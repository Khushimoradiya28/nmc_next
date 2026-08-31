import React, { useState, useEffect, useContext } from "react";
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
import BannerServices from "../services/BannerServices";
import { notifySuccess, notifyError } from "../utils/toast";

const Banner = () => {
  const { toggleDrawer, isDrawerOpen, toggleModal } = useContext(SidebarContext);

  // State management
  const [bannerList, setBannerList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItemId, setDeleteItemId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const resultsPerPage = 8;

  // 1. Fetch Banners List from Backend API
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await BannerServices.getAllBanners({
        page: currentPage,
        limit: resultsPerPage,
        status: "all",
      });

      if (res && res.data) {
        setBannerList(res.data);
        setTotalResults(res.meta?.total_records || res.data.length);
      }
    } catch (err) {
      console.error("Failed to fetch banners:", err);
      notifyError(err?.message || "Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [currentPage]);

  // 2. Toggle active/inactive status
  const handleToggleStatus = async (item) => {
    try {
      const id = item._id || item.id;
      const newStatus = item.status === "active" ? "inactive" : "active";
      
      const res = await BannerServices.updateBannerStatus(id, newStatus);
      if (res && (res.status === 200 || res.success)) {
        setBannerList((prev) =>
          prev.map((b) => ((b._id || b.id) === id ? { ...b, status: newStatus, isActive: newStatus === "active" } : b))
        );
        notifySuccess("Banner status updated to " + newStatus + "!");
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);
      notifyError(err?.message || "Failed to update banner status");
    }
  };

  // 3. Open Delete Modal
  const handleOpenDeleteModal = (id) => {
    setDeleteItemId(id);
    toggleModal();
  };

  // 4. Perform Delete Action
  const handleConfirmDelete = async (id) => {
    try {
      const targetId = id || deleteItemId;
      const res = await BannerServices.deleteBanner(targetId);
      if (res && (res.status === 200 || res.success)) {
        notifySuccess("Banner deleted successfully!");
        fetchBanners();
      }
    } catch (err) {
      console.error("Failed to delete banner:", err);
      notifyError(err?.message || "Failed to delete banner");
    }
  };

  // 5. Save (Add or Update) item callback from drawer
  const handleSaveDrawer = async (savedData) => {
    try {
      if (editItem) {
        const id = editItem._id || editItem.id;
        await BannerServices.updateBanner(id, savedData);
        notifySuccess("Banner updated successfully!");
      } else {
        await BannerServices.addBanner(savedData);
        notifySuccess("Banner added successfully!");
      }
      fetchBanners();
      toggleDrawer();
      setEditItem(null);
    } catch (err) {
      console.error("Failed to save banner:", err);
      notifyError(err?.response?.data?.message || err?.message || "Failed to save banner");
    }
  };

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

          {bannerList && bannerList.length > 0 ? (
            <BannerTable
              banners={bannerList}
              onEdit={(item) => {
                setEditItem(item);
                toggleDrawer();
              }}
              onDelete={handleOpenDeleteModal}
              onToggleStatus={handleToggleStatus}
            />
          ) : null}
        </Table>

        {(!bannerList || bannerList.length === 0) && !loading && (
          <div className="py-12 bg-white dark:bg-gray-800">
            <NotFound title="No Banner Images Found" />
          </div>
        )}

        <TableFooter>
          <Pagination
            totalResults={totalResults}
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
