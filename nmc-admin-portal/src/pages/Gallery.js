import React, { useState, useEffect, useContext } from 'react';
import {
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableFooter,
  Pagination,
  Button,
  Input,
} from '@windmill/react-ui';
import { FiPlus, FiSearch, FiRotateCw } from 'react-icons/fi';

import PageTitle from '../components/Typography/PageTitle';
import NotFound from '../components/table/NotFound';
import GalleryTable from '../components/gallery/GalleryTable';
import GalleryDrawer from '../components/drawer/GalleryDrawer';
import MainDrawer from '../components/drawer/MainDrawer';
import MainModal from '../components/modal/MainModal';
import CustomSelect from '../components/form/CustomSelect';
import { SidebarContext } from '../context/SidebarContext';
import GalleryService from '../services/GalleryService';
import { notifySuccess, notifyError } from '../utils/toast';

const categoryFilterOptions = [
  { value: 'All', label: 'All Categories' },
  { value: 'campus_labs', label: 'Campus & Labs' },
  { value: 'events_culture', label: 'Events & Culture' },
  { value: 'video_highlights', label: 'Video Highlights' },
];

const mediaTypeFilterOptions = [
  { value: 'All', label: 'All Media Types' },
  { value: 'image', label: 'Photo (Images)' },
  { value: 'video', label: 'Video Tours' },
];

const Gallery = () => {
  const { toggleDrawer, isDrawerOpen, toggleModal } = useContext(SidebarContext);

  const [galleryList, setGalleryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMediaType, setSelectedMediaType] = useState('All');

  const [editItem, setEditItem] = useState(null);
  const [deleteItemId, setDeleteItemId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const resultsPerPage = 8;

  const fetchGallery = async (customParams = {}) => {
    try {
      setLoading(true);
      const pageToFetch = customParams.page !== undefined ? customParams.page : currentPage;
      const searchToFetch = customParams.search !== undefined ? customParams.search : searchQuery;
      const categoryToFetch = customParams.category !== undefined ? customParams.category : selectedCategory;
      const mediaTypeToFetch = customParams.media_type !== undefined ? customParams.media_type : selectedMediaType;

      const res = await GalleryService.getAllGallery({
        page: pageToFetch,
        limit: resultsPerPage,
        search: searchToFetch,
        category: categoryToFetch,
        media_type: mediaTypeToFetch,
        status: 'all',
      });

      if (res && res.data) {
        setGalleryList(res.data);
        setTotalResults(res.meta?.total_records || res.data.length);
      }
    } catch (err) {
      console.error('Failed to fetch gallery:', err);
      notifyError(err?.message || 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [currentPage, selectedCategory, selectedMediaType]);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      setCurrentPage(1);
      fetchGallery({ page: 1, search: searchQuery });
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      const id = item._id || item.id;
      const newStatus = item.status === 'active' ? 'inactive' : 'active';
      const res = await GalleryService.updateGalleryStatus(id, newStatus);
      if (res && (res.status === 200 || res.success)) {
        setGalleryList((prev) =>
          prev.map((g) =>
            (g._id || g.id) === id
              ? { ...g, status: newStatus, isActive: newStatus === 'active' }
              : g
          )
        );
        notifySuccess('Gallery item status updated to ' + newStatus + '!');
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
      notifyError(err?.message || 'Failed to update status');
    }
  };

  const handleOpenDeleteModal = (id) => {
    setDeleteItemId(id);
    toggleModal();
  };

  const handleConfirmDelete = async (id) => {
    try {
      const targetId = id || deleteItemId;
      const res = await GalleryService.deleteGallery(targetId);
      if (res && (res.status === 200 || res.success)) {
        notifySuccess('Gallery item deleted successfully!');
        fetchGallery();
      }
    } catch (err) {
      console.error('Failed to delete gallery item:', err);
      notifyError(err?.message || 'Failed to delete gallery item');
    }
  };

  const handleSaveDrawer = async (savedData) => {
    try {
      if (editItem) {
        const id = editItem._id || editItem.id;
        await GalleryService.updateGallery(id, savedData);
        notifySuccess('Gallery item updated successfully!');
      } else {
        await GalleryService.addGallery(savedData);
        notifySuccess('Gallery item added successfully!');
      }
      fetchGallery();
      toggleDrawer();
      setEditItem(null);
    } catch (err) {
      console.error('Failed to save gallery item:', err);
      notifyError(err?.response?.data?.message || err?.message || 'Failed to save gallery item');
    }
  };

  const handleResetFilters = async () => {
    setIsRefreshing(true);
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedMediaType('All');
    setCurrentPage(1);
    await fetchGallery({ page: 1, search: '', category: 'All', media_type: 'All' });
    notifySuccess('Gallery filters reset & refreshed!');
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <>
      {/* Page Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4'>
        <div>
          <PageTitle>Photo & Video Gallery</PageTitle>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            Manage photo and video gallery items, categories, and site visibility.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditItem(null);
            toggleDrawer();
          }}
          className='bg-red-700 hover:bg-red-800 text-white rounded-md text-xs font-semibold px-4 py-2.5 flex items-center justify-center gap-2 transition-colors shrink-0 shadow-sm'
        >
          <FiPlus size={16} /> Add Gallery Media
        </Button>
      </div>

      {/* Main Drawer Container */}
      <MainDrawer>
        <GalleryDrawer
          open={isDrawerOpen}
          onClose={() => {
            if (isDrawerOpen) toggleDrawer();
            setEditItem(null);
          }}
          onSave={handleSaveDrawer}
          editData={editItem}
        />
      </MainDrawer>

      {/* Control Bar: Search & Custom Dropdowns */}
      <div className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xs border border-gray-100 dark:border-gray-700 mb-6'>
        <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-3'>
          {/* Search Input */}
          <div className='relative flex-grow max-w-md'>
            <Input
              type='search'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder='Search gallery media... (Press Enter)'
              className='border h-10 text-xs focus:outline-none block w-full bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white dark:text-gray-200 rounded-md pl-10 pr-4'
            />
            <FiSearch
              className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'
              size={14}
            />
          </div>

          {/* Custom Select Category & Media Type Dropdowns */}
          <div className='flex flex-wrap items-center gap-3'>
            <div className='w-44'>
              <CustomSelect
                options={categoryFilterOptions}
                value={selectedCategory}
                onChange={(val) => {
                  setSelectedCategory(val);
                  setCurrentPage(1);
                }}
                placeholder='Category'
                heightClass='h-10'
                textSize='text-xs'
              />
            </div>

            <div className='w-40'>
              <CustomSelect
                options={mediaTypeFilterOptions}
                value={selectedMediaType}
                onChange={(val) => {
                  setSelectedMediaType(val);
                  setCurrentPage(1);
                }}
                placeholder='Media Type'
                heightClass='h-10'
                textSize='text-xs'
              />
            </div>

            {/* Reset Filters */}
            <button
              onClick={handleResetFilters}
              disabled={isRefreshing || loading}
              className='bg-red-700 hover:bg-red-800 active:scale-95 text-white h-10 w-10 rounded-md flex items-center justify-center transition-all duration-200 focus:outline-none shadow-xs hover:shadow-md cursor-pointer disabled:opacity-75'
              title='Reset Filters & Refresh List'
            >
              <FiRotateCw
                size={16}
                className={'text-white transition-transform duration-500 ' + (isRefreshing ? 'animate-spin' : 'hover:rotate-45')}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <TableContainer className='mb-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xs'>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Sr. No.</TableCell>
              <TableCell>Media Preview</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Media Type</TableCell>
              <TableCell className='text-center'>Status</TableCell>
              <TableCell>Time Stamp</TableCell>
              <TableCell className='text-right'>Actions</TableCell>
            </tr>
          </TableHeader>

          {galleryList && galleryList.length > 0 ? (
            <GalleryTable
              items={galleryList}
              onEdit={(item) => {
                setEditItem(item);
                toggleDrawer();
              }}
              onDelete={handleOpenDeleteModal}
              onToggleStatus={handleToggleStatus}
            />
          ) : null}
        </Table>

        {(!galleryList || galleryList.length === 0) && !loading && (
          <div className='py-12 bg-white dark:bg-gray-800'>
            <NotFound title='No Gallery Items Found' />
          </div>
        )}

        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onChange={(p) => setCurrentPage(p)}
            label='Gallery Navigation'
          />
        </TableFooter>
      </TableContainer>

      {/* Common Project Delete Modal */}
      <MainModal id={deleteItemId} onDeleteConfirm={handleConfirmDelete} />
    </>
  );
};

export default Gallery;
