import React, { useState, useMemo, useContext } from "react";
import {
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableFooter,
  Pagination,
  Button,
} from "@windmill/react-ui";
import { FiPlus } from "react-icons/fi";

import PageTitle from "../components/Typography/PageTitle";
import NotFound from "../components/table/NotFound";
import BannerTable from "../components/banner/BannerTable";
import BannerDrawer from "../components/drawer/BannerDrawer";
import MainDrawer from "../components/drawer/MainDrawer";
import MainModal from "../components/modal/MainModal";
import { SidebarContext } from "../context/SidebarContext";
import mockBanners from "../utils/mockBanners";
import { notifySuccess } from "../utils/toast";

const Banner = () => {
  const { toggleDrawer, isDrawerOpen, toggleModal } = useContext(SidebarContext);

  // State management
  const [bannerList, setBannerList] = useState(mockBanners);
  const [editItem, setEditItem] = useState(null);
  const [deleteItemId, setDeleteItemId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 8;

  // Toggle active/inactive status
  const handleToggleStatus = (id) => {
    setBannerList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: !item.status } : item
      )
    );
  };

  // Open Delete MainModal
  const handleOpenDeleteModal = (id) => {
    setDeleteItemId(id);
    toggleModal();
  };

  // Perform Delete Action
  const handleConfirmDelete = (id) => {
    setBannerList((prev) => prev.filter((item) => item.id !== id));
    notifySuccess("Banner slide deleted successfully!");
  };

  // Save (Add or Update) item callback from drawer
  const handleSaveDrawer = (savedData) => {
    if (editItem) {
      setBannerList((prev) =>
        prev.map((item) => (item.id === savedData.id ? savedData : item))
      );
      notifySuccess("Banner slide updated successfully!");
    } else {
      setBannerList((prev) => [savedData, ...prev]);
      notifySuccess("Banner slide added successfully!");
    }
    toggleDrawer();
    setEditItem(null);
  };

  // Paginated Items
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * resultsPerPage;
    return bannerList.slice(startIndex, startIndex + resultsPerPage);
  }, [bannerList, currentPage, resultsPerPage]);

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4 my-2">
        <div>
          <PageTitle>Home Banner</PageTitle>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Manage homepage slider background images (add, update, delete, or toggle visibility).
          </p>
        </div>
        <Button
          onClick={() => {
            setEditItem(null);
            toggleDrawer();
          }}
          className="bg-red-700 hover:bg-red-800 text-white rounded-md text-xs font-semibold px-4 py-2.5 flex items-center justify-center gap-2 transition-colors shrink-0 shadow-sm"
        >
          <FiPlus size={16} /> Add Banner Image
        </Button>
      </div>

      {/* Main Drawer Container */}
      <MainDrawer>
        <BannerDrawer
          open={isDrawerOpen}
          onClose={() => {
            if (isDrawerOpen) toggleDrawer();
            setEditItem(null);
          }}
          onSave={handleSaveDrawer}
          editData={editItem}
        />
      </MainDrawer>

      {/* Main Table Container */}
      <TableContainer className="mb-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xs">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Sr. No.</TableCell>
              <TableCell>Banner Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell className="text-center">Active Status</TableCell>
              <TableCell>Time Stamp</TableCell>
              <TableCell className="text-right">Actions</TableCell>
            </tr>
          </TableHeader>

          {paginatedItems.length > 0 ? (
            <BannerTable
              banners={paginatedItems}
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
            <NotFound title="No Banner Images Found" />
          </div>
        )}

        <TableFooter>
          <Pagination
            totalResults={bannerList.length}
            resultsPerPage={resultsPerPage}
            onChange={(p) => setCurrentPage(p)}
            label="Banner Navigation"
          />
        </TableFooter>
      </TableContainer>

      {/* Common Project Delete Modal */}
      <MainModal id={deleteItemId} onDeleteConfirm={handleConfirmDelete} />
    </>
  );
};

export default Banner;
