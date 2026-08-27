import React from 'react';
import { FiX, FiClock, FiDollarSign, FiBookOpen, FiList } from 'react-icons/fi';

const formatFee = (val) => {
  if (!val) return 'Contact for details';
  const str = String(val).trim();
  if (str.startsWith('₹') || str.startsWith('Rs.') || str.startsWith('Rs')) {
    return str;
  }
  return `₹${str}`;
};

const getProgramTypeStyle = (programType) => {
  switch (programType?.toLowerCase()) {
    case 'ug':
      return 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300';
    case 'pg':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300';
    case 'diploma':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const getProgramTypeLabel = (programType) => {
  switch (programType?.toLowerCase()) {
    case 'ug':
      return 'Undergraduate (UG)';
    case 'pg':
      return 'Postgraduate (PG)';
    case 'diploma':
      return 'Diploma / Vocational';
    default:
      return programType?.toUpperCase() || 'PROGRAM';
  }
};

const AcademicProgramDetailModal = ({ isOpen, onClose, program }) => {
  if (!isOpen || !program) return null;

  const highlightsList = Array.isArray(program.highlights)
    ? program.highlights
    : (program.highlights || '').split('\n').map((item) => item.trim()).filter(Boolean);

  const feeDisplay = formatFee(program.fees || program.fee);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden p-6 sm:p-8 my-8 text-left transition-all transform">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Top Header: Badge & Program Info */}
        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-800/50 flex items-center justify-center shrink-0">
            <FiBookOpen className="w-10 h-10 text-red-800 dark:text-red-400" />
          </div>

          <div className="flex-1 pr-6">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${getProgramTypeStyle(program.programType || program.category)}`}>
                {getProgramTypeLabel(program.programType || program.category)}
              </span>
              {program.degreeBadge && (
                <span className="inline-block px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {program.degreeBadge}
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 dark:text-gray-100 leading-tight">
              {program.shortTitle || program.shortName}
            </h2>
            <p className="text-red-800 dark:text-red-400 font-bold text-sm sm:text-base mt-1">
              {program.fullName}
            </p>
          </div>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          <div className="bg-blue-50/50 dark:bg-gray-700/40 border border-blue-100/80 dark:border-gray-600 rounded-2xl p-4">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-widest block">
              DURATION
            </span>
            <div className="flex items-center gap-2 mt-1">
              <FiClock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                {program.duration || 'N/A'}
              </span>
            </div>
          </div>

          <div className="bg-blue-50/50 dark:bg-gray-700/40 border border-blue-100/80 dark:border-gray-600 rounded-2xl p-4">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-widest block">
              FEES STRUCTURE
            </span>
            <div className="flex items-center gap-2 mt-1">
              <FiDollarSign className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                {feeDisplay}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-5">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Program Description
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {program.description || 'No description available.'}
          </p>
        </div>

        {/* Highlights */}
        {highlightsList.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <FiList className="w-4 h-4 text-red-800 dark:text-red-400" />
              Program Highlights
            </h3>
            <div className="space-y-2">
              {highlightsList.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-red-800 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AcademicProgramDetailModal;
