import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableFooter,
  TableContainer,
  Pagination,
  Button,
  Input,
} from "@windmill/react-ui";
import { FiArrowUp, FiArrowDown, FiRotateCw, FiUpload, FiSearch } from "react-icons/fi";
import { CSVDownloader } from "react-papaparse";

import PageTitle from "../components/Typography/PageTitle";
import Breadcrumb from "../components/form/Breadcrumb";
import NotFound from "../components/table/NotFound";
import LeadTable from "../components/lead/LeadTable";
import MainModal from "../components/modal/MainModal";
import CustomDateRangePicker from "../components/form/CustomDateRangePicker";
import LeadServices from "../services/LeadServices";
import { notifySuccess, notifyError } from "../utils/toast";

const Leads = () => {
  const [leadsList, setLeadsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [deleteItemId, setDeleteItemId] = useState(null);

  // Sorting & Filtering State
  const [sortOrder, setSortOrder] = useState("desc");
  const [filters, setFilters] = useState({
    from_date: "",
    to_date: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const resultsPerPage = 8;

  const searchRef = useRef(null);

  // Fetch Leads from Backend API
  const fetchLeads = async (customParams = {}) => {
    try {
      setLoading(true);
      const pageToFetch = customParams.page !== undefined ? customParams.page : currentPage;
      const searchToFetch = customParams.search !== undefined ? customParams.search : searchText;
      const sortToFetch = customParams.sort_order !== undefined ? customParams.sort_order : sortOrder;
      const fromToFetch = customParams.from_date !== undefined ? customParams.from_date : filters.from_date;
      const toToFetch = customParams.to_date !== undefined ? customParams.to_date : filters.to_date;

      const res = await LeadServices.getAllLeads({
        page: pageToFetch,
        limit: resultsPerPage,
        search: searchToFetch,
        sort_order: sortToFetch,
        from_date: fromToFetch,
        to_date: toToFetch,
        status: "all",
      });

      if (res && res.data) {
        setLeadsList(res.data);
        setTotalResults(res.meta?.total_records || res.data.length);
      }
    } catch (err) {
      console.error("Failed to fetch leads:", err);
      notifyError(err?.message || "Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  // Live Search with Debounce (300ms) + immediate trigger on filters
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads({ page: currentPage, search: searchText });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText, currentPage, sortOrder, filters.from_date, filters.to_date]);

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      setCurrentPage(1);
      fetchLeads({ page: 1, search: searchText });
    }
  };

  const handleOpenDeleteModal = (id) => {
    setDeleteItemId(id);
  };

  const handleConfirmDelete = async (id) => {
    try {
      const targetId = id || deleteItemId;
      const res = await LeadServices.deleteLead(targetId);
      if (res && (res.status === 200 || res.success)) {
        notifySuccess("Lead deleted successfully!");
        fetchLeads();
      }
    } catch (err) {
      console.error("Failed to delete lead:", err);
      notifyError(err?.message || "Failed to delete lead");
    }
  };

  const toggleSortOrder = () => {
    const newSort = sortOrder === "desc" ? "asc" : "desc";
    setSortOrder(newSort);
    setCurrentPage(1);
  };

  const handleResetAll = async () => {
    setIsRefreshing(true);
    setSearchText("");
    if (searchRef.current) {
      searchRef.current.value = "";
    }
    setFilters({
      from_date: "",
      to_date: "",
    });
    setSortOrder("desc");
    setCurrentPage(1);
    await fetchLeads({
      page: 1,
      search: "",
      sort_order: "desc",
      from_date: "",
      to_date: "",
    });
    notifySuccess("Leads filters reset & refreshed!");
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // CSV Export data
  const exportData = useMemo(() => {
    return leadsList.map((item, index) => ({
      "Sr. No.": (currentPage - 1) * resultsPerPage + index + 1,
      Name: `${item.first_name || ""} ${item.last_name || ""}`.trim() || item.full_name || "",
      Phone: item.phone || item.mobile || "",
      Email: item.email || "",
      Website: item.website || "",
      "Reason Contacting Us": item.reason || "",
      Course: item.course || "",
      "Teacher / Department": item.teacher || item.teacher_department || "",
      Message: item.message || "",
      "Created At": item.created_at || "",
    }));
  }, [leadsList, currentPage, resultsPerPage]);

  return (
    <>
      <Breadcrumb title="Contact Us Leads" />
      <PageTitle>Contact Us Leads</PageTitle>

      {/* Control Bar: Matching Gallery / Faculty Design Standards Exactly */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xs mb-6 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Left: Professional Search Bar with Search Icon */}
          <div className="relative flex-grow max-w-md">
            <input
              ref={searchRef}
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
              onKeyDown={handleSearchKeyDown}
              className="border h-10 text-xs focus:outline-none block w-full bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white dark:text-gray-200 rounded-md pl-10 pr-4"
              type="search"
              placeholder="Search leads... (Press Enter)"
            />
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={14}
            />
          </div>

          {/* Right: Date Range + Sort + Refresh + CSV Export (Perfect compact gap-3 grouping) */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Custom Reusable Date Range Picker */}
            <CustomDateRangePicker
              fromDate={filters.from_date}
              toDate={filters.to_date}
              onFromDateChange={(val) => {
                setFilters((prev) => ({ ...prev, from_date: val }));
                setCurrentPage(1);
              }}
              onToDateChange={(val) => {
                setFilters((prev) => ({ ...prev, to_date: val }));
                setCurrentPage(1);
              }}
            />

            {/* Ascending / Descending Date Sort Toggle */}
            <button
              type="button"
              onClick={toggleSortOrder}
              className="bg-red-700 hover:bg-red-800 active:scale-95 text-white h-10 px-3.5 rounded-md flex items-center justify-center gap-1.5 text-xs font-semibold shrink-0 shadow-xs transition-all duration-200 focus:outline-none cursor-pointer"
              title={`Sort Date ${sortOrder === "desc" ? "Descending (Newest First)" : "Ascending (Oldest First)"}`}
            >
              {sortOrder === "desc" ? (
                <>
                  <FiArrowDown size={14} className="text-white" />
                  <span>Newest</span>
                </>
              ) : (
                <>
                  <FiArrowUp size={14} className="text-white" />
                  <span>Oldest</span>
                </>
              )}
            </button>

            {/* Reset Search & Date Filters Button with 360 Spin Animation */}
            <button
              type="button"
              onClick={handleResetAll}
              disabled={isRefreshing || loading}
              className="bg-red-700 hover:bg-red-800 active:scale-95 text-white h-10 w-10 rounded-md flex items-center justify-center transition-all duration-200 focus:outline-none shadow-xs hover:shadow-md cursor-pointer shrink-0 disabled:opacity-75"
              title="Reset Search & Filters"
            >
              <FiRotateCw
                size={15}
                className={"text-white transition-transform duration-500 " + (isRefreshing ? "animate-spin" : "hover:rotate-45")}
              />
            </button>

            {/* Export CSV Button */}
            <CSVDownloader
              data={exportData}
              filename={`contact_leads_${new Date().toISOString().slice(0, 10)}`}
            >
              <button
                type="button"
                className="bg-red-700 hover:bg-red-800 active:scale-95 text-white h-10 w-10 rounded-md flex items-center justify-center transition-all duration-200 focus:outline-none shadow-xs hover:shadow-md cursor-pointer shrink-0 disabled:opacity-50"
                disabled={!exportData.length}
                title="Export CSV"
              >
                <FiUpload size={15} className="text-white" />
              </button>
            </CSVDownloader>
          </div>
        </div>
      </div>

      {leadsList && leadsList.length > 0 ? (
        <TableContainer className="mb-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xs">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>Sr. No.</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Website</TableCell>
                <TableCell>Reason contacting us</TableCell>
                <TableCell>Choose Course</TableCell>
                <TableCell>Teacher / Department</TableCell>
                <TableCell>Your Message</TableCell>
                <TableCell>Time Stamp</TableCell>
                <TableCell className="text-right">Actions</TableCell>
              </tr>
            </TableHeader>
            <LeadTable
              products={leadsList}
              currentPage={currentPage}
              resultsPerPage={resultsPerPage}
              totalResults={totalResults}
              sortOrder={sortOrder}
              onDelete={handleOpenDeleteModal}
            />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              onChange={(p) => setCurrentPage(p)}
              label="Leads Page Navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <div className="py-12 bg-white dark:bg-gray-800">
          <NotFound title="No Contact Us Leads Found" />
        </div>
      )}

      {/* Common Project Delete Modal */}
      <MainModal id={deleteItemId} onDeleteConfirm={handleConfirmDelete} />
    </>
  );
};

export default Leads;
