import React, { useState, useContext, useEffect, useRef, useMemo } from 'react';
import {
  Table,
  TableContainer,
  TableFooter,
  Button,
} from '@windmill/react-ui';
import { FiPlus, FiSearch, FiRefreshCw } from 'react-icons/fi';

import PageTitle from '../../components/Typography/PageTitle';
import Breadcrumb from '../../components/form/Breadcrumb';
import AcademicProgramTable from '../../components/academic-program/AcademicProgramTable';
import AcademicProgramDetailModal from '../../components/academic-program/AcademicProgramDetailModal';
import AcademicProgramDrawer from '../../components/drawer/AcademicProgramDrawer';
import MainDrawer from '../../components/drawer/MainDrawer';
import MainModal from '../../components/modal/MainModal';
import CustomSelect from '../../components/form/CustomSelect';
import CustomPagination from '../../components/table/CustomPagination';
import Loading from '../../components/preloader/Loading';
import NotFound from '../../components/table/NotFound';
import { SidebarContext } from '../../context/SidebarContext';
import useToggleDrawer from '../../hooks/useToggleDrawer';
import AcademicProgramServices from '../../services/AcademicProgramServices';

const PROGRAM_TYPE_OPTIONS = [
  { label: 'All Program Types', value: 'all' },
  { label: 'Undergraduate (UG)', value: 'ug' },
  { label: 'Postgraduate (PG)', value: 'pg' },
  { label: 'Diploma & Vocational', value: 'diploma' },
];

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

// Helper to normalize strings for search (removes dots, spaces, special chars)
const normalizeSearch = (str) => {
  if (!str) return '';
  return String(str).toLowerCase().replace(/[\.\s\-\/\(\)]+/g, '');
};

const AcademicPrograms = () => {
  const { toggleDrawer, isUpdate, setIsUpdate } = useContext(SidebarContext);
  const { serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [selectedProgramType, setSelectedProgramType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  // Detail View Modal State
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedProgramForView, setSelectedProgramForView] = useState(null);

  const searchInputRef = useRef(null);

  // Fetch academic programs from backend API
  const fetchAcademicPrograms = async (backendSearchTerm = '') => {
    setLoading(true);
    try {
      const params = {
        page: 1,
        limit: 200,
        search: backendSearchTerm ? backendSearchTerm.trim() : '',
        programType: selectedProgramType !== 'all' ? selectedProgramType : '',
        status: selectedStatus !== 'all' ? selectedStatus : '',
      };

      const res = await AcademicProgramServices.getAllPrograms(params);
      const list = res?.data || res?.programs || (Array.isArray(res) ? res : []);
      setPrograms(Array.isArray(list) ? list : []);
      setCurrentPage(1);
    } catch (err) {
      console.error('Error fetching academic programs:', err);
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademicPrograms();
  }, [selectedProgramType, selectedStatus]);

  useEffect(() => {
    if (isUpdate) {
      fetchAcademicPrograms();
      setIsUpdate(false);
    }
  }, [isUpdate]);

  // Client-side instant search and filter
  const filteredPrograms = useMemo(() => {
    const rawTerm = (searchText || '').toLowerCase().trim();
    const normalizedTerm = normalizeSearch(rawTerm);

    return programs.filter((item) => {
      // 1. Check Search Match
      let matchesSearch = true;
      if (rawTerm) {
        const shortTitle = item.shortTitle || item.shortName || '';
        const fullName = item.fullName || '';
        const badge = item.degreeBadge || '';
        const desc = item.description || '';

        const normShort = normalizeSearch(shortTitle);
        const normFull = normalizeSearch(fullName);
        const normBadge = normalizeSearch(badge);
        const normDesc = normalizeSearch(desc);

        matchesSearch =
          shortTitle.toLowerCase().includes(rawTerm) ||
          fullName.toLowerCase().includes(rawTerm) ||
          badge.toLowerCase().includes(rawTerm) ||
          desc.toLowerCase().includes(rawTerm) ||
          normShort.includes(normalizedTerm) ||
          normFull.includes(normalizedTerm) ||
          normBadge.includes(normalizedTerm) ||
          normDesc.includes(normalizedTerm);
      }

      // 2. Check Program Type Match
      const matchesType =
        selectedProgramType === 'all' ||
        (item.programType || item.category || '').toLowerCase() === selectedProgramType.toLowerCase();

      // 3. Check Status Match
      const matchesStatus =
        selectedStatus === 'all' ||
        (item.status || '').toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [programs, searchText, selectedProgramType, selectedStatus]);

  // Client-side pagination
  const totalResults = filteredPrograms.length;
  const paginatedPrograms = useMemo(() => {
    const start = (currentPage - 1) * resultsPerPage;
    return filteredPrograms.slice(start, start + resultsPerPage);
  }, [filteredPrograms, currentPage, resultsPerPage]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const val = searchInputRef.current?.value || searchText || '';
    setSearchText(val);
    setCurrentPage(1);
    fetchAcademicPrograms(val);
  };

  const handleSearchInputChange = (e) => {
    const val = e.target.value;
    setSearchText(val);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchText('');
    setSelectedProgramType('all');
    setSelectedStatus('all');
    setCurrentPage(1);
    if (searchInputRef.current) searchInputRef.current.value = '';
    fetchAcademicPrograms('');
  };

  const handleOpenViewModal = (item) => {
    setSelectedProgramForView(item);
    setDetailModalOpen(true);
  };

  return (
    <>
      <MainModal id={serviceId} />

      {/* Slide-over Form Drawer */}
      <MainDrawer>
        <AcademicProgramDrawer id={serviceId} />
      </MainDrawer>

      {/* Header Title + Breadcrumb & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 my-2">
        <div className="flex flex-col text-left w-full sm:w-auto">
          <PageTitle>Academic Programs</PageTitle>
          <Breadcrumb
            items={[
              { label: 'Masters', link: '/master' },
              { label: 'Academic Programs' },
            ]}
          />
        </div>

        <Button
          onClick={toggleDrawer}
          className="w-full sm:w-auto rounded-md h-10 flex items-center justify-center gap-2"
        >
          <FiPlus className="w-5 h-5" />
          <span>Add Program</span>
        </Button>
      </div>

      {/* Action Bar: Search Input & Category Filters */}
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-xs mb-6 border border-gray-100 dark:border-gray-700 p-4 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by program name or degree..."
              value={searchText}
              onChange={handleSearchInputChange}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-red-800 dark:text-gray-200 transition-colors"
            />
            <FiSearch className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
          </form>

          {/* Program Type Filter */}
          <div className="w-full">
            <CustomSelect
              options={PROGRAM_TYPE_OPTIONS}
              value={selectedProgramType}
              onChange={(val) => {
                setSelectedProgramType(val);
                setCurrentPage(1);
              }}
              placeholder="All Program Types"
            />
          </div>

          {/* Status Filter */}
          <div className="w-full">
            <CustomSelect
              options={STATUS_OPTIONS}
              value={selectedStatus}
              onChange={(val) => {
                setSelectedStatus(val);
                setCurrentPage(1);
              }}
              placeholder="All Statuses"
            />
          </div>

          {/* Reset / Search Trigger */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSearchSubmit}
              className="w-full h-10 text-xs font-semibold rounded-lg"
            >
              Search
            </Button>
            <Button
              onClick={handleResetFilters}
              variant="outline"
              className="h-10 px-3 rounded-lg flex items-center justify-center"
              title="Reset Filters"
            >
              <FiRefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Data Table / Loading / NotFound States */}
      {loading ? (
        <Loading loading={loading} />
      ) : filteredPrograms.length !== 0 ? (
        <TableContainer className="mb-8 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xs relative z-10">
          <Table>
            <AcademicProgramTable
              programs={paginatedPrograms}
              currentPage={currentPage}
              resultsPerPage={resultsPerPage}
              onViewDetails={handleOpenViewModal}
              onEdit={handleUpdate}
              onDelete={handleModalOpen}
            />
          </Table>

          <TableFooter>
            <CustomPagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              currentPage={currentPage}
              onChange={(p) => setCurrentPage(p)}
              label="Academic Programs Navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Academic Programs" />
      )}

      {/* Program Detail Modal */}
      <AcademicProgramDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        program={selectedProgramForView}
      />
    </>
  );
};

export default AcademicPrograms;
