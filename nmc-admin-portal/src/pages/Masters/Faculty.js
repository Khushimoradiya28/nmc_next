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
import { notifyError } from '../../utils/toast';

const DEPARTMENT_OPTIONS = [
  { label: 'All Departments', value: 'all' },
  { label: 'B.B.A.', value: 'B.B.A.' },
  { label: 'B.Com / Commerce', value: 'B.Com' },
  { label: 'Economics', value: 'Economics' },
  { label: 'B.C.A. & IT', value: 'B.C.A' },
  { label: 'Science & Bio-Tech', value: 'Science' },
];

const Faculty = () => {
  const {
    toggleDrawer,
    isDrawerOpen,
    closeDrawer,
    openModal,
    isUpdate,
    setIsUpdate,
  } = useContext(SidebarContext);

  const [serviceId, setServiceId] = useState(null);
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const resultsPerPage = 10;

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

      const listData = res?.data || [];
      const meta = res?.meta;

      setFacultyList(listData);
      setTotalRecords(meta?.total_records ?? listData.length);
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
    openModal();
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
              placeholder="Search by faculty name, qualification..."
              value={searchText}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-red-800 dark:text-gray-200 transition-colors"
            />
            <FiSearch className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          </div>

          {/* CustomSelect Department Dropdown */}
          <div className="w-full md:w-64">
            <CustomSelect
              options={DEPARTMENT_OPTIONS}
              value={selectedDept}
              onChange={handleDeptChange}
              placeholder="All Departments"
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
