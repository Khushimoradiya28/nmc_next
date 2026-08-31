import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableFooter,
  TableContainer,
  Pagination,
  Input,
} from "@windmill/react-ui";
import { FiArrowUp, FiArrowDown, FiRotateCw, FiUpload, FiSearch } from "react-icons/fi";
import { CSVDownloader } from "react-papaparse";

import PageTitle from "../components/Typography/PageTitle";
import Breadcrumb from "../components/form/Breadcrumb";
import NotFound from "../components/table/NotFound";
import AdmissionTable from "../components/admission/AdmissionTable";
import MainModal from "../components/modal/MainModal";
import CustomDateRangePicker from "../components/form/CustomDateRangePicker";
import AdmissionLeadServices from "../services/AdmissionLeadServices";
import { notifySuccess, notifyError } from "../utils/toast";

const Admissions = () => {
  const [admissionsList, setAdmissionsList] = useState([]);
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

  // Fetch Real Admission Leads from Backend API
  const fetchAdmissions = async (customParams = {}) => {
    try {
      setLoading(true);
      const pageToFetch = customParams.page !== undefined ? customParams.page : currentPage;
      const searchToFetch = customParams.search !== undefined ? customParams.search : searchText;
      const sortToFetch = customParams.sort_order !== undefined ? customParams.sort_order : sortOrder;
      const fromToFetch = customParams.from_date !== undefined ? customParams.from_date : filters.from_date;
      const toToFetch = customParams.to_date !== undefined ? customParams.to_date : filters.to_date;

      const res = await AdmissionLeadServices.getAllAdmissions({
        page: pageToFetch,
        limit: resultsPerPage,
        search: searchToFetch,
        sort_order: sortToFetch,
        from_date: fromToFetch,
        to_date: toToFetch,
        status: "all",
      });

      if (res && res.data) {
        setAdmissionsList(res.data);
        setTotalResults(res.meta?.total_records || res.data.length);
      }
    } catch (err) {
      console.error("Failed to fetch admission leads:", err);
      notifyError(err?.message || "Failed to load admission leads");
    } finally {
      setLoading(false);
    }
  };

  // Live Search with Debounce (300ms) + immediate trigger on filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAdmissions({ page: currentPage, search: searchText });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText, currentPage, sortOrder, filters.from_date, filters.to_date]);

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      setCurrentPage(1);
      fetchAdmissions({ page: 1, search: searchText });
    }
  };

  const handleOpenDeleteModal = (id) => {
    setDeleteItemId(id);
  };

  const handleConfirmDelete = async (id) => {
    try {
      const targetId = id || deleteItemId;
      const res = await AdmissionLeadServices.deleteAdmission(targetId);
      if (res && (res.status === 200 || res.success)) {
        notifySuccess("Admission lead deleted successfully!");
        fetchAdmissions();
      }
    } catch (err) {
      console.error("Failed to delete admission lead:", err);
      notifyError(err?.message || "Failed to delete admission lead");
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
    await fetchAdmissions({
      page: 1,
      search: "",
      sort_order: "desc",
      from_date: "",
      to_date: "",
    });
    notifySuccess("Admission leads reset & refreshed!");
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // CSV Export data
  const exportData = useMemo(() => {
    return admissionsList.map((item, index) => ({
      "Sr. No.": (currentPage - 1) * resultsPerPage + index + 1,
      "Full Name": item.full_name || "",
      "Mobile Number": item.mobile || "",
      "Email Address": item.email || "",
      "Date of Birth": item.dob || "",
      Gender: item.gender || "",
      "City / Village": item.city_village || "",
      "Course Interested In": item.course || "",
      "Last Qualification": item.last_qualification || "",
      "Created At": item.created_at || "",
    }));
  }, [admissionsList, currentPage, resultsPerPage]);

  return (
    <>
      <Breadcrumb title="Admission Leads" />
      <PageTitle>Admission Leads</PageTitle>

      {/* Control Bar: Exact Matching Style */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xs mb-6 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Left: Search Input */}
          <div className="relative flex-grow max-w-md">
            <Input
              ref={searchRef}
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
              onKeyDown={handleSearchKeyDown}
              className="border h-10 text-xs focus:outline-none block w-full bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white dark:text-gray-200 rounded-md pl-10 pr-4"
              type="search"
              placeholder="Search admission leads... (Press Enter)"
            />
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={14}
            />
          </div>

          {/* Right Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Custom Date Range Picker */}
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

            {/* Reset Search & Date Filters Button */}
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
              filename={`admission_leads_${new Date().toISOString().slice(0, 10)}`}
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

      {admissionsList && admissionsList.length > 0 ? (
        <TableContainer className="mb-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xs">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>Sr. No.</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Mobile Number</TableCell>
                <TableCell>Email Address</TableCell>
                <TableCell>Date of Birth</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>City / Village</TableCell>
                <TableCell>Course Interested In</TableCell>
                <TableCell>Last Qualification</TableCell>
                <TableCell>Time Stamp</TableCell>
                <TableCell className="text-right">Actions</TableCell>
              </tr>
            </TableHeader>
            <AdmissionTable
              admissions={admissionsList}
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
              label="Admission Leads Navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <div className="py-12 bg-white dark:bg-gray-800 rounded-lg">
          <NotFound title="No Admission Leads Found" />
        </div>
      )}

      {/* Common Project Delete Modal */}
      <MainModal id={deleteItemId} onDeleteConfirm={handleConfirmDelete} />
    </>
  );
};

export default Admissions;
