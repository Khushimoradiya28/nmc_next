import React, { useState, useContext, useEffect, useCallback } from 'react';
import {
  Table,
  TableContainer,
  TableFooter,
  Pagination,
  Button,
} from '@windmill/react-ui';
import { FiPlus, FiSearch } from 'react-icons/fi';

import PageTitle from '../../components/Typography/PageTitle';
import FacultyTable from '../../components/faculty/FacultyTable';
import FacultyDetailModal from '../../components/faculty/FacultyDetailModal';
import FacultyDrawer from '../../components/drawer/FacultyDrawer';
import MainDrawer from '../../components/drawer/MainDrawer';
import MainModal from '../../components/modal/MainModal';
import CustomSelect from '../../components/form/CustomSelect';
import { SidebarContext } from '../../context/SidebarContext';
import FacultyServices from '../../services/FacultyServices';
import AcademicProgramServices from '../../services/AcademicProgramServices';
import CourseServices from '../../services/CourseServices';
import { notifyError } from '../../utils/toast';

const Faculty = () => {
  const {
    toggleDrawer,
    isDrawerOpen,
    closeDrawer,
    toggleModal,
    isUpdate,
    setIsUpdate,
  } = useContext(SidebarContext);

  const [serviceId, setServiceId] = useState(null);
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [filterOptions, setFilterOptions] = useState([{ label: 'All Streams / Programs', value: 'all' }]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const resultsPerPage = 10;

  // Fetch dynamic streams from Academic Programs & Professional / Certificate Courses in strict sequence (UG -> PG -> Diploma -> Certificate)
  useEffect(() => {
    Promise.allSettled([
      AcademicProgramServices.getAllPrograms({ page: 1, limit: 100 }),
      CourseServices.getAllCourses({ page: 1, limit: 100 }),
    ])
      .then(([progRes, courseRes]) => {
        const progData =
          progRes.status === 'fulfilled'
            ? progRes.value?.data || progRes.value?.programs || (Array.isArray(progRes.value) ? progRes.value : [])
            : [];
        const courseData =
          courseRes.status === 'fulfilled'
            ? courseRes.value?.data || courseRes.value?.courses || (Array.isArray(courseRes.value) ? courseRes.value : [])
            : [];

        const getRank = (item) => {
          const type = (item.programType || item.category || '').toLowerCase().trim();
          if (type === 'ug') return 1;
          if (type === 'pg') return 2;
          if (type === 'diploma') return 3;
          // Fallback based on name if programType is not explicitly tagged
          const title = (item.shortTitle || item.fullName || item.title || '').toUpperCase();
          if (title.startsWith('B.') || title.startsWith('BCA') || title.startsWith('BBA') || title.startsWith('BSC') || title.startsWith('BA')) return 1;
          if (title.startsWith('M.') || title.startsWith('MSW') || title.startsWith('MCA') || title.startsWith('MSC') || title.startsWith('MA')) return 2;
          if (title.includes('DIPLOMA') || title.includes('DFD') || title.includes('CFD')) return 3;
          return 4;
        };

        const sortedPrograms = (Array.isArray(progData) ? [...progData] : []).sort((a, b) => {
          const rankA = getRank(a);
          const rankB = getRank(b);
          if (rankA !== rankB) return rankA - rankB;
          return (a.sort_order || 0) - (b.sort_order || 0);
        });

        const sortedCourses = (Array.isArray(courseData) ? [...courseData] : []).sort((a, b) => {
          return (a.sortOrder || 0) - (b.sortOrder || 0);
        });

        const opts = [{ label: 'All Streams / Programs', value: 'all' }];
        const seen = new Set();

        // 1. Add Academic Programs in strict sequence: UG -> PG -> Diploma
        sortedPrograms.forEach((item) => {
          const short = (item.shortTitle || item.shortName || item.fullName || '').trim();
          if (short && !seen.has(short.toLowerCase())) {
            seen.add(short.toLowerCase());
            opts.push({ label: short, value: short });
          }
        });

        // 2. Add Professional / Certificate Courses
        sortedCourses.forEach((item) => {
          const title = (item.title || item.name || '').trim();
          if (title && !seen.has(title.toLowerCase())) {
            seen.add(title.toLowerCase());
            opts.push({ label: title, value: title });
          }
        });

        setFilterOptions(opts);
      })
      .catch((err) => console.error('Filter options error:', err));
  }, []);

  // Selected faculty for Detail Modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedFacultyForView, setSelectedFacultyForView] = useState(null);

  // Delete item ID for MainModal
  const [deleteItemId, setDeleteItemId] = useState(null);

  // Fetch Faculty List from Backend API
  const fetchFacultyList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await FacultyServices.getAllFaculty({
        page: currentPage,
        limit: resultsPerPage,
        search: searchText,
        department: selectedDept,
      });

      const listData =
        res?.data?.faculties ||
        res?.data?.faculty ||
        res?.data ||
        res?.faculties ||
        res?.faculty ||
        (Array.isArray(res) ? res : []);
      const meta = res?.meta || res?.data?.meta;

      const finalArray = Array.isArray(listData) ? listData : [];
      setFacultyList(finalArray);
      setTotalRecords(meta?.total_records ?? meta?.total ?? finalArray.length);
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message || 'Failed to fetch faculty list');
      setFacultyList([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
      setIsUpdate(false);
    }
  }, [currentPage, resultsPerPage, searchText, selectedDept, setIsUpdate]);

  useEffect(() => {
    fetchFacultyList();
  }, [fetchFacultyList]);

  // Refetch when isUpdate flag changes
  useEffect(() => {
    if (isUpdate) {
      fetchFacultyList();
    }
  }, [isUpdate, fetchFacultyList]);

  // Reset to Page 1 when filter or search changes
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  const handleDeptChange = (val) => {
    setSelectedDept(val);
    setCurrentPage(1);
  };

  const handleOpenAddDrawer = () => {
    setServiceId(null);
    toggleDrawer();
  };

  const handleOpenEditDrawer = (item) => {
    setServiceId(item.slug || item._id || item.id);
    toggleDrawer();
  };

  const handleOpenViewModal = (item) => {
    setSelectedFacultyForView(item);
    setDetailModalOpen(true);
  };

  const handleDeleteItem = (item) => {
    setDeleteItemId(item.slug || item._id || item.id);
    toggleModal();
  };

  return (
    <>
      {/* Header Title & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 my-6">
        <div>
          <PageTitle>Professors & Faculty</PageTitle>
          <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2">
            Manage esteemed professors, department heads, and academic leaders.
          </p>
        </div>

        <Button
          onClick={handleOpenAddDrawer}
          className="bg-red-800 hover:bg-red-900 text-white font-semibold flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-sm"
        >
          <FiPlus className="w-5 h-5" />
          <span>Add Faculty</span>
        </Button>
      </div>

      {/* Action Bar: Search Input & CustomSelect Department Filter */}
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-xs mb-6 border border-gray-100 dark:border-gray-700 p-4 relative z-30">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by name, designation & role..."
              value={searchText}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-red-800 dark:text-gray-200 transition-colors"
            />
            <FiSearch className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          </div>

          {/* CustomSelect Department/Stream Dropdown */}
          <div className="w-full md:w-64">
            <CustomSelect
              options={filterOptions}
              value={selectedDept}
              onChange={handleDeptChange}
              placeholder="All Streams / Programs"
            />
          </div>
        </div>
      </div>

      {/* Faculty Data Table */}
      <TableContainer className="mb-8 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xs relative z-10">
        {loading ? (
          <div className="py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
            Loading faculty records...
          </div>
        ) : facultyList.length === 0 ? (
          <div className="py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
            No faculty members found.
          </div>
        ) : (
          <Table>
            <FacultyTable
              faculties={facultyList}
              currentPage={currentPage}
              resultsPerPage={resultsPerPage}
              onViewDetails={handleOpenViewModal}
              onEdit={handleOpenEditDrawer}
              onDelete={handleDeleteItem}
            />
          </Table>
        )}

        {totalRecords > 0 && (
          <TableFooter>
            <Pagination
              totalResults={totalRecords}
              resultsPerPage={resultsPerPage}
              onChange={(p) => setCurrentPage(p)}
              label="Faculty Navigation"
            />
          </TableFooter>
        )}
      </TableContainer>

      {/* Faculty Detail Modal */}
      <FacultyDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        faculty={selectedFacultyForView}
        idOrSlug={selectedFacultyForView?.slug || selectedFacultyForView?._id}
      />

      {/* Slide-over Form Drawer */}
      <MainDrawer isDrawerOpen={isDrawerOpen} closeDrawer={closeDrawer}>
        <FacultyDrawer id={serviceId} />
      </MainDrawer>

      {/* Confirmation Modal */}
      <MainModal id={deleteItemId} />
    </>
  );
};

export default Faculty;
