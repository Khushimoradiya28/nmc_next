import React, { useState, useMemo, useContext } from "react";
import {
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableFooter,
  Pagination,
  Input,
  Button,
} from "@windmill/react-ui";
import {
  FiPlus,
  FiSearch,
  FiRotateCw,
} from "react-icons/fi";
import PageTitle from "../components/Typography/PageTitle";
import NotFound from "../components/table/NotFound";
import GalleryTable from "../components/gallery/GalleryTable";
import GalleryDrawer from "../components/drawer/GalleryDrawer";
import MainDrawer from "../components/drawer/MainDrawer";
import MainModal from "../components/modal/MainModal";
import CustomSelect from "../components/form/CustomSelect";
import { SidebarContext } from "../context/SidebarContext";
import mockGallery from "../utils/mockGallery";
import { notifySuccess } from "../utils/toast";

const categoryFilterOptions = [
  { label: "All Categories", value: "All" },
  { label: "Campus & Labs", value: "Campus & Labs" },
  { label: "Events & Culture", value: "Events & Culture" },
  { label: "Video Highlights", value: "Video Highlights" },
];

const mediaTypeFilterOptions = [
  { label: "All Media Types", value: "All" },
  { label: "Photos", value: "image" },
  { label: "Videos", value: "video" },
];

const Gallery = () => {
  const { toggleDrawer, isDrawerOpen, toggleModal } = useContext(SidebarContext);

  // State management
  const [galleryList, setGalleryList] = useState(mockGallery);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMediaType, setSelectedMediaType] = useState("All");
  
  // Local edit & delete item state
  const [editItem, setEditItem] = useState(null);
  const [deleteItemId, setDeleteItemId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 8;

  // Toggle active/inactive status
  const handleToggleStatus = (id) => {
    setGalleryList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: !item.status } : item
      )
    );
  };

  // Open MainModal for delete
  const handleOpenDeleteModal = (id) => {
    setDeleteItemId(id);
    toggleModal();
  };

  // Perform Delete Callback
  const handleConfirmDelete = (id) => {
    setGalleryList((prev) => prev.filter((item) => item.id !== id));
    notifySuccess("Gallery item deleted successfully!");
  };

  // Save (Add or Update) item callback from drawer
  const handleSaveDrawer = (savedData) => {
    if (editItem) {
      setGalleryList((prev) =>
        prev.map((item) => (item.id === savedData.id ? savedData : item))
      );
      notifySuccess("Gallery item updated successfully!");
    } else {
      setGalleryList((prev) => [savedData, ...prev]);
      notifySuccess("Gallery item added successfully!");
    }
    toggleDrawer();
    setEditItem(null);
  };

  // Reset all search & category filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedMediaType("All");
    setCurrentPage(1);
  };

  // Filter Logic
  const filteredItems = useMemo(() => {
    return galleryList.filter((item) => {
      // 1. Search Query Filter (Title or Description)
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        (item.title && item.title.toLowerCase().includes(query)) ||
        (item.description && item.description.toLowerCase().includes(query));

      // 2. Category Filter
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      // 3. Media Type Filter
      const matchesMediaType =
        selectedMediaType === "All" || item.mediaType === selectedMediaType;

      return matchesSearch && matchesCategory && matchesMediaType;
    });
  }, [galleryList, searchQuery, selectedCategory, selectedMediaType]);

  // Paginated Items
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * resultsPerPage;
    return filteredItems.slice(startIndex, startIndex + resultsPerPage);
  }, [filteredItems, currentPage, resultsPerPage]);

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <PageTitle>Photo & Video Gallery</PageTitle>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Manage photo and video gallery items, categories, and site visibility.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditItem(null);
            toggleDrawer();
          }}
          className="bg-red-700 hover:bg-red-800 text-white rounded-md text-xs font-semibold px-4 py-2.5 flex items-center justify-center gap-2 transition-colors shrink-0 shadow-sm"
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
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xs border border-gray-100 dark:border-gray-700 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-grow max-w-md">
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gallery media..."
              className="border h-10 text-xs focus:outline-none block w-full bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white dark:text-gray-200 rounded-md pl-10 pr-4"
            />
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={14}
            />
          </div>

          {/* Custom Select Category & Media Type Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-44">
              <CustomSelect
                options={categoryFilterOptions}
                value={selectedCategory}
                onChange={(val) => {
                  setSelectedCategory(val);
                  setCurrentPage(1);
                }}
                placeholder="Category"
                heightClass="h-10"
                textSize="text-xs"
              />
            </div>

            <div className="w-40">
              <CustomSelect
                options={mediaTypeFilterOptions}
                value={selectedMediaType}
                onChange={(val) => {
                  setSelectedMediaType(val);
                  setCurrentPage(1);
                }}
                placeholder="Media Type"
                heightClass="h-10"
                textSize="text-xs"
              />
            </div>

            {/* Reset Filters */}
            <button
              onClick={handleResetFilters}
              className="bg-red-700 hover:bg-red-800 text-white h-10 w-10 rounded-md flex items-center justify-center transition-colors focus:outline-none"
              title="Reset Filters"
            >
              <FiRotateCw size={14} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <TableContainer className="mb-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xs">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Sr. No.</TableCell>
              <TableCell>Media Preview</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Media Type</TableCell>
              <TableCell className="text-center">Status</TableCell>
              <TableCell>Time Stamp</TableCell>
              <TableCell className="text-right">Actions</TableCell>
            </tr>
          </TableHeader>

          {paginatedItems.length > 0 ? (
            <GalleryTable
              items={paginatedItems}
              onEdit={(item) => {
                setEditItem(item);
                toggleDrawer();
              }}
              onDelete={handleOpenDeleteModal}
              onToggleStatus={handleToggleStatus}
            />
          ) : null}
        </Table>

        {paginatedItems.length === 0 && (
          <div className="py-12 bg-white dark:bg-gray-800">
            <NotFound title="No Gallery Items Found" />
          </div>
        )}

        <TableFooter>
          <Pagination
            totalResults={filteredItems.length}
            resultsPerPage={resultsPerPage}
            onChange={(p) => setCurrentPage(p)}
            label="Gallery Navigation"
          />
        </TableFooter>
      </TableContainer>

      {/* Common Project Delete Modal */}
      <MainModal id={deleteItemId} onDeleteConfirm={handleConfirmDelete} />
    </>
  );
};

export default Gallery;
