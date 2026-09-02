import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Table, TableContainer, TableFooter, Pagination, Button } from '@windmill/react-ui';
import { FiPlus, FiSearch, FiUploadCloud } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

import PageTitle from '../../components/Typography/PageTitle';
import RankerTable from '../../components/ranker/RankerTable';
import RankerDetailModal from '../../components/ranker/RankerDetailModal';
import RankerDrawer from '../../components/drawer/RankerDrawer';
import MainDrawer from '../../components/drawer/MainDrawer';
import MainModal from '../../components/modal/MainModal';
import CustomSelect from '../../components/form/CustomSelect';
import { SidebarContext } from '../../context/SidebarContext';
import RankerServices from '../../services/RankerServices';
import { notifyError } from '../../utils/toast';

const Ranker = () => {
  const { toggleDrawer, isDrawerOpen, closeDrawer, toggleModal, isUpdate, setIsUpdate } = useContext(SidebarContext);

  const [serviceId, setServiceId] = useState(null);
  const [rankerList, setRankerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedProgramme, setSelectedProgramme] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  const [programmeOptions, setProgrammeOptions] = useState([{ label: 'All Programmes', value: 'all' }]);
  const [yearOptions, setYearOptions] = useState([{ label: 'All Years', value: 'all' }]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const resultsPerPage = 10;

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedForView, setSelectedForView] = useState(null);
  const [deleteItemId, setDeleteItemId] = useState(null);

  const buildFilterOptions = useCallback(async () => {
    try {
      const res = await RankerServices.getAllRankers({ page: 1, limit: 300 });
      const list = res?.data || (Array.isArray(res) ? res : []);
      if (Array.isArray(list)) {
        const progSeen = new Set();
        const yearSeen = new Set();
        const progOpts = [{ label: 'All Programmes', value: 'all' }];
        const yearOpts = [{ label: 'All Years', value: 'all' }];
        list.forEach((item) => {
          const prog = (item.programme || '').trim();
          const year = (item.academicYear || '').trim();
          if (prog && !progSeen.has(prog.toLowerCase())) {
            progSeen.add(prog.toLowerCase());
            progOpts.push({ label: prog, value: prog });
          }
          if (year && !yearSeen.has(year.toLowerCase())) {
            yearSeen.add(year.toLowerCase());
            yearOpts.push({ label: year, value: year });
          }
        });
        setProgrammeOptions(progOpts);
        setYearOptions(yearOpts);
      }
    } catch (err) {
      console.error('Filter options error:', err);
    }
  }, []);

  useEffect(() => {
    buildFilterOptions();
  }, [buildFilterOptions]);

  const fetchRankerList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await RankerServices.getAllRankers({
        page: currentPage,
        limit: resultsPerPage,
        search: searchText,
        programme: selectedProgramme,
        academicYear: selectedYear,
      });
      const listData = res?.data || (Array.isArray(res) ? res : []);
      const meta = res?.meta || res?.data?.meta;
      const finalArray = Array.isArray(listData) ? listData : [];
      setRankerList(finalArray);
      setTotalRecords(meta?.total_records ?? meta?.total ?? finalArray.length);
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message || 'Failed to fetch rankers');
      setRankerList([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
      setIsUpdate(false);
    }
  }, [currentPage, resultsPerPage, searchText, selectedProgramme, selectedYear, setIsUpdate]);

  useEffect(() => {
    fetchRankerList();
  }, [fetchRankerList]);

  useEffect(() => {
    if (isUpdate) {
      fetchRankerList();
      buildFilterOptions();
    }
  }, [isUpdate, fetchRankerList, buildFilterOptions]);

  const handleSearchChange = (e) => { setSearchText(e.target.value); setCurrentPage(1); };
  const handleProgrammeChange = (val) => { setSelectedProgramme(val); setCurrentPage(1); };
  const handleYearChange = (val) => { setSelectedYear(val); setCurrentPage(1); };

  const handleOpenAddDrawer = () => { setServiceId(null); toggleDrawer(); };
  const handleOpenEditDrawer = (item) => { setServiceId(item.slug || item._id || item.id); toggleDrawer(); };
  const handleOpenViewModal = (item) => { setSelectedForView(item); setDetailModalOpen(true); };
  const handleDeleteItem = (item) => { setDeleteItemId(item.slug || item._id || item.id); toggleModal(); };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 my-6">
        <div>
          <PageTitle>University Rankers</PageTitle>
          <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2">
            Manage university rank holders by programme, semester and academic year.
          </p>
        </div>
        <div className="flex gap-3">
          <NavLink to="/master/rankers/bulk-import">
            <Button layout="outline" className="font-semibold flex items-center gap-2 px-5 py-2.5 rounded-lg">
              <FiUploadCloud className="w-5 h-5" />
              <span>Bulk Import</span>
            </Button>
          </NavLink>
          <Button
            onClick={handleOpenAddDrawer}
            className="bg-red-800 hover:bg-red-900 text-white font-semibold flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-sm"
          >
            <FiPlus className="w-5 h-5" />
            <span>Add Ranker</span>
          </Button>
        </div>
      </div>

      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-xs mb-6 border border-gray-100 dark:border-gray-700 p-4 relative z-30">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by name, programme & semester..."
              value={searchText}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:border-red-800 dark:text-gray-200 transition-colors"
            />
            <FiSearch className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="w-full sm:w-52">
              <CustomSelect options={programmeOptions} value={selectedProgramme} onChange={handleProgrammeChange} placeholder="All Programmes" />
            </div>
            <div className="w-full sm:w-44">
              <CustomSelect options={yearOptions} value={selectedYear} onChange={handleYearChange} placeholder="All Years" />
            </div>
          </div>
        </div>
      </div>

      <TableContainer className="mb-8 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xs relative z-10">
        {loading ? (
          <div className="py-12 text-center text-gray-500 dark:text-gray-400 text-sm">Loading ranker records...</div>
        ) : rankerList.length === 0 ? (
          <div className="py-12 text-center text-gray-500 dark:text-gray-400 text-sm">No rankers found.</div>
        ) : (
          <Table>
            <RankerTable
              rankers={rankerList}
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
            <Pagination totalResults={totalRecords} resultsPerPage={resultsPerPage} onChange={(p) => setCurrentPage(p)} label="Ranker Navigation" />
          </TableFooter>
        )}
      </TableContainer>

      <RankerDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        ranker={selectedForView}
        idOrSlug={selectedForView?.slug || selectedForView?._id}
      />

      <MainDrawer isDrawerOpen={isDrawerOpen} closeDrawer={closeDrawer}>
        <RankerDrawer id={serviceId} />
      </MainDrawer>

      <MainModal id={deleteItemId} />
    </>
  );
};

export default Ranker;
