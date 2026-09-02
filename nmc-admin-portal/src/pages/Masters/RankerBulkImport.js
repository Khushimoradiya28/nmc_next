import React, { useContext, useState, useRef, useCallback } from 'react';
import { Button } from '@windmill/react-ui';
import {
  FiUploadCloud,
  FiFileText,
  FiDownload,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiArrowLeft,
  FiRefreshCw,
} from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

import PageTitle from '../../components/Typography/PageTitle';
import RankerServices from '../../services/RankerServices';
import { SidebarContext } from '../../context/SidebarContext';
import { notifySuccess, notifyError } from '../../utils/toast';

const FRONTEND_URL = (process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');

const resolveEvidence = (data) => {
  const raw = (data && data.evidence ? data.evidence : '').toString().replace(/\\/g, '/');
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith('/assets/')) return `${FRONTEND_URL}${raw}`;
  return raw;
};

const TEMPLATE_HEADERS = [
  'Sr. No.',
  'Academic Year',
  'Programme',
  'Semester / Year',
  'Student Name',
  'University Rank',
  'Achievement',
  'Evidence',
];
const TEMPLATE_SAMPLE = ['1,2011-12,B.A.,BA SEM-1,PAREKH KHUSHBHU,1,University Rank Holder,'];

const RankerBulkImport = () => {
  const { setIsUpdate } = useContext(SidebarContext);

  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [phase, setPhase] = useState('idle');
  const [uploadPercent, setUploadPercent] = useState(0);
  const [auditPercent, setAuditPercent] = useState(0);
  const [report, setReport] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const resetAll = () => {
    setFile(null);
    setPhase('idle');
    setUploadPercent(0);
    setAuditPercent(0);
    setReport(null);
    setImportResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileSelect = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const name = f.name.toLowerCase();
    const allowed = ['.csv', '.xlsx', '.xls'];
    if (!allowed.some((ext) => name.endsWith(ext))) {
      notifyError('Only .csv, .xlsx or .xls files are allowed.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setFile(f);
    setReport(null);
    setImportResult(null);
    setPhase('idle');
    setUploadPercent(0);
    setAuditPercent(0);
  };

  const runAuditAnimation = useCallback(() => {
    setAuditPercent(0);
    let pct = 0;
    const timer = setInterval(() => {
      pct = Math.min(90, pct + Math.max(1, Math.round((90 - pct) * 0.15)));
      setAuditPercent(pct);
    }, 120);
    return timer;
  }, []);

  const handleValidate = async () => {
    if (!file) {
      notifyError('Please choose a file first.');
      return;
    }
    try {
      setReport(null);
      setImportResult(null);
      setPhase('uploading');
      setUploadPercent(0);

      const res = await RankerServices.bulkValidate(file, (pct) => {
        setUploadPercent(pct);
        if (pct >= 100) setPhase('auditing');
      });

      setPhase('auditing');
      const auditTimer = runAuditAnimation();
      await new Promise((r) => setTimeout(r, 500));
      clearInterval(auditTimer);
      setAuditPercent(100);

      setReport(res);
      setPhase('result');
    } catch (err) {
      const data = err?.response?.data;
      const msg =
        (Array.isArray(data?.errors) && data.errors.join(' ')) ||
        data?.message ||
        err?.message ||
        'Failed to validate file.';
      notifyError(msg);
      setPhase('idle');
      setUploadPercent(0);
      setAuditPercent(0);
    }
  };

  const handleImport = async () => {
    if (!report || !report.valid || report.valid.length === 0) {
      notifyError('There are no valid rows to import.');
      return;
    }
    try {
      setImporting(true);
      const res = await RankerServices.bulkImport(report.valid);
      setImportResult(res);
      setIsUpdate(true);
      notifySuccess(res?.message || 'Bulk import completed.');
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message || 'Bulk import failed.');
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const csv = [TEMPLATE_HEADERS.join(','), ...TEMPLATE_SAMPLE].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ranker-import-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toOrdinal = (n) => {
    const num = parseInt(n);
    if (isNaN(num)) return n;
    const s = ['TH', 'ST', 'ND', 'RD'];
    const v = num % 100;
    return `${num}${s[(v - 20) % 10] || s[v] || s[0]}`;
  };

  const summary = report?.summary;
  const validRows = report?.valid || [];
  const invalidRows = report?.invalid || [];
  const busy = phase === 'uploading' || phase === 'auditing';

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 my-6">
        <div>
          <PageTitle>Rankers — Bulk Import</PageTitle>
          <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2">
            Upload a CSV/XLSX to add multiple rankers at once. Data is audited before import.
          </p>
        </div>
        <div className="flex gap-3">
          <NavLink to="/master/rankers">
            <Button layout="outline" className="flex items-center gap-2">
              <FiArrowLeft className="w-4 h-4" /> Back to List
            </Button>
          </NavLink>
          <Button onClick={downloadTemplate} layout="outline" className="flex items-center gap-2">
            <FiDownload className="w-4 h-4" /> Sample CSV
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xs border border-gray-100 dark:border-gray-700 p-6 mb-6">
        <div
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-red-700 transition-colors"
          onClick={() => !busy && fileInputRef.current && fileInputRef.current.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            onChange={handleFileSelect}
            className="hidden"
            disabled={busy}
          />
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 dark:bg-gray-700 mb-3">
            <FiUploadCloud className="w-7 h-7 text-red-800 dark:text-red-300" />
          </span>
          {file ? (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-700 dark:text-gray-200 font-medium">
              <FiFileText className="w-4 h-4 text-red-700" /> {file.name}
            </div>
          ) : (
            <>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Click to choose a file</p>
              <p className="text-xs text-gray-400 mt-1">Supported: .csv, .xlsx, .xls (max 10MB)</p>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mt-5">
          <Button onClick={handleValidate} disabled={!file || busy} className="bg-red-800 hover:bg-red-900 text-white flex items-center gap-2">
            <FiCheckCircle className="w-4 h-4" />
            {busy ? 'Processing...' : 'Upload & Validate'}
          </Button>
          {(file || report) && (
            <Button onClick={resetAll} layout="outline" disabled={busy} className="flex items-center gap-2">
              <FiRefreshCw className="w-4 h-4" /> Reset
            </Button>
          )}
        </div>

        {(phase === 'uploading' || uploadPercent > 0) && phase !== 'idle' && (
          <div className="mt-5">
            <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              <span>Uploading file</span>
              <span>{uploadPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-200" style={{ width: `${uploadPercent}%` }} />
            </div>
          </div>
        )}

        {(phase === 'auditing' || (phase === 'result' && auditPercent > 0)) && (
          <div className="mt-4">
            <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              <span>Auditing rows &amp; columns</span>
              <span>{auditPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 transition-all duration-200" style={{ width: `${auditPercent}%` }} />
            </div>
          </div>
        )}
      </div>

      {phase === 'result' && summary && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg p-4 flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700">
                <FiFileText className="w-5 h-5 text-gray-500" />
              </span>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Total Rows</p>
                <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{summary.total_rows}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-green-100 dark:border-gray-700 rounded-lg p-4 flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/30">
                <FiCheckCircle className="w-5 h-5 text-green-600" />
              </span>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Valid</p>
                <p className="text-xl font-bold text-green-600">{summary.valid_count}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-red-100 dark:border-gray-700 rounded-lg p-4 flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/30">
                <FiXCircle className="w-5 h-5 text-red-600" />
              </span>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Invalid</p>
                <p className="text-xl font-bold text-red-600">{summary.invalid_count}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {validRows.length > 0
                ? `${validRows.length} valid row(s) ready to import.`
                : 'No valid rows to import. Fix the issues below and re-upload.'}
            </p>
            <Button
              onClick={handleImport}
              disabled={validRows.length === 0 || importing || !!importResult}
              className="bg-red-800 hover:bg-red-900 text-white"
            >
              {importing ? 'Importing...' : importResult ? 'Imported' : `Import ${validRows.length} Valid Row(s)`}
            </Button>
          </div>

          {importResult && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 text-sm font-medium">
              {importResult.message}
              {importResult.summary && (
                <span className="ml-1">
                  (Inserted: {importResult.summary.inserted}, Skipped: {importResult.summary.skipped})
                </span>
              )}
            </div>
          )}

          {invalidRows.length > 0 && (
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden mb-6">
              <div className="px-5 py-3 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-800 flex items-center gap-2">
                <FiAlertTriangle className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-bold text-red-800 dark:text-red-200">
                  Invalid Rows ({invalidRows.length}) — fix these and re-upload
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
                      <th className="px-4 py-2">Row</th>
                      <th className="px-4 py-2">Image</th>
                      <th className="px-4 py-2">Student Name</th>
                      <th className="px-4 py-2">Column</th>
                      <th className="px-4 py-2">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invalidRows.map((item) => {
                      const evUrl = resolveEvidence(item.data);
                      return item.errors.map((e, ei) => (
                        <tr key={`${item.row}-${ei}`} className="border-t border-gray-100 dark:border-gray-700">
                          {ei === 0 ? (
                            <td className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-200" rowSpan={item.errors.length}>
                              {item.row}
                            </td>
                          ) : null}
                          {ei === 0 ? (
                            <td className="px-4 py-2" rowSpan={item.errors.length}>
                              {evUrl ? (
                                <img
                                  src={evUrl}
                                  alt={item.data?.name || 'evidence'}
                                  className="w-12 h-12 rounded-md object-cover border border-gray-200 dark:border-gray-600 bg-gray-50"
                                  onError={(ev) => { ev.currentTarget.style.display = 'none'; }}
                                />
                              ) : (
                                <span className="text-xs text-gray-400 italic">no image</span>
                              )}
                            </td>
                          ) : null}
                          {ei === 0 ? (
                            <td className="px-4 py-2 text-gray-600 dark:text-gray-300" rowSpan={item.errors.length}>
                              {item.data?.name || <span className="text-gray-400 italic">(blank)</span>}
                            </td>
                          ) : null}
                          <td className="px-4 py-2">
                            <span className="inline-block px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs font-medium">
                              {e.column}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{e.reason}</td>
                        </tr>
                      ));
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {validRows.length > 0 && (
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="px-5 py-3 bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-800 flex items-center gap-2">
                <FiCheckCircle className="w-4 h-4 text-green-600" />
                <h3 className="text-sm font-bold text-green-800 dark:text-green-200">Valid Rows ({validRows.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
                      <th className="px-4 py-2">Row</th>
                      <th className="px-4 py-2">Image</th>
                      <th className="px-4 py-2">Student Name</th>
                      <th className="px-4 py-2">Rank</th>
                      <th className="px-4 py-2">Programme</th>
                      <th className="px-4 py-2">Sem / Year</th>
                      <th className="px-4 py-2">Academic Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {validRows.map((item) => {
                      const evUrl = resolveEvidence(item.data);
                      return (
                        <tr key={item.row} className="border-t border-gray-100 dark:border-gray-700">
                          <td className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-200">{item.row}</td>
                          <td className="px-4 py-2">
                            {evUrl ? (
                              <img
                                src={evUrl}
                                alt={item.data?.name || 'evidence'}
                                className="w-12 h-12 rounded-md object-cover border border-gray-200 dark:border-gray-600 bg-gray-50"
                                onError={(e) => { e.currentTarget.style.display = 'none'; if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = 'inline'; }}
                              />
                            ) : null}
                            <span className="text-xs text-gray-400 italic" style={{ display: evUrl ? 'none' : 'inline' }}>
                              {evUrl ? 'not found' : 'no image'}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-gray-700 dark:text-gray-200 font-medium">{item.data?.name}</td>
                          <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{toOrdinal(item.data?.rankNum)}</td>
                          <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{item.data?.programme}</td>
                          <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{item.data?.semesterYear}</td>
                          <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{item.data?.academicYear}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default RankerBulkImport;
