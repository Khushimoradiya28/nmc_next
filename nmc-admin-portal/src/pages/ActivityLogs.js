import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableFooter,
  TableContainer,
  Pagination,
  Input,
  Select,
} from "@windmill/react-ui";
import { FiArrowUp, FiArrowDown, FiRotateCw, FiUpload, FiSearch } from "react-icons/fi";
import { CSVDownloader } from "react-papaparse";

import PageTitle from "../components/Typography/PageTitle";
import Breadcrumb from "../components/form/Breadcrumb";
import NotFound from "../components/table/NotFound";
import CustomDateRangePicker from "../components/form/CustomDateRangePicker";
import ActivityLogTable from "../components/activity/ActivityLogTable";
import ActivityLogServices from "../services/ActivityLogServices";
import { notifySuccess, notifyError } from "../utils/toast";

const ActivityLogs = () => {
  const [logsList, setLogsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Filter States
  const [roleFilter, setRoleFilter] = useState("all");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filters, setFilters] = useState({
    from_date: "",
    to_date: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const resultsPerPage = 20;

  const searchRef = useRef(null);

  // Fetch Activity Logs from Backend API
  const fetchActivityLogs = async (customParams = {}) => {
    try {
      setLoading(true);
      const pageToFetch = customParams.page !== undefined ? customParams.page : currentPage;
      const searchToFetch = customParams.search !== undefined ? customParams.search : searchText;
      const roleToFetch = customParams.role_name !== undefined ? customParams.role_name : roleFilter;
      const moduleToFetch = customParams.module !== undefined ? customParams.module : moduleFilter;
      const actionToFetch = customParams.action !== undefined ? customParams.action : actionFilter;
      const sortToFetch = customParams.sort_order !== undefined ? customParams.sort_order : sortOrder;
      const fromToFetch = customParams.from_date !== undefined ? customParams.from_date : filters.from_date;
      const toToFetch = customParams.to_date !== undefined ? customParams.to_date : filters.to_date;

      const res = await ActivityLogServices.getActivityLogs({
        page: pageToFetch,
        limit: resultsPerPage,
        search: searchToFetch,
        role_name: roleToFetch,
        module: moduleToFetch,
        action: actionToFetch,
        sort_order: sortToFetch,
        from_date: fromToFetch,
        to_date: toToFetch,
      });

      if (res && res.data) {
        setLogsList(res.data);
        setTotalResults(res.meta?.total_records || res.data.length);
      }
    } catch (err) {
      console.error("Failed to fetch activity logs:", err);
      notifyError(err?.message || "Failed to load activity logs");
    } finally {
      setLoading(false);
    }
  };

  // Live Search with Debounce (300ms) + immediate trigger on filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchActivityLogs({
        page: currentPage,
        search: searchText,
        role_name: roleFilter,
        module: moduleFilter,
        action: actionFilter,
        sort_order: sortOrder,
        from_date: filters.from_date,
        to_date: filters.to_date,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [
    searchText,
    currentPage,
    roleFilter,
    moduleFilter,
    actionFilter,
    sortOrder,
    filters.from_date,
    filters.to_date,
  ]);

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      setCurrentPage(1);
      fetchActivityLogs({ page: 1, search: searchText });
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
    setRoleFilter("all");
    setModuleFilter("all");
    setActionFilter("all");
    setFilters({
      from_date: "",
      to_date: "",
    });
    setSortOrder("desc");
    setCurrentPage(1);
    await fetchActivityLogs({
      page: 1,
      search: "",
      role_name: "all",
      module: "all",
      action: "all",
      sort_order: "desc",
      from_date: "",
      to_date: "",
    });
    notifySuccess("Activity logs filters reset & refreshed!");
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // CSV Export Data
  const exportData = useMemo(() => {
    return logsList.map((item, index) => {
      const serialNo =
        sortOrder === "asc"
          ? (currentPage - 1) * resultsPerPage + index + 1
          : Math.max(1, (totalResults || logsList.length) - ((currentPage - 1) * resultsPerPage + index));

      return {
        "Sr. No.": serialNo,
        "Date & Time": item.created_at || "",
        "User Name": item.user_name || "",
        "User Email": item.user_email || "",
        "Role": item.role_name || "",
        "Action": item.action || "",
        "Module": item.module || "",
        "Description": item.description || item.record_title || "",
        "IP Address": item.ip_address || "",
      };
    });
  }, [logsList, currentPage, resultsPerPage, totalResults, sortOrder]);

  return (
    <>
      <Breadcrumb title="Activity Logs" />
      <PageTitle>Activity Logs</PageTitle>

      {/* Filter and Control Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xs mb-6 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
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
              placeholder="Search logs by user, email, module, description... (Press Enter)"
            />
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={14}
            />
          </div>

          {/* Right Controls: Filters & Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Role Filter */}
            <Select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 text-xs border bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white dark:text-gray-200 rounded-md px-3"
            >
              <option value="all">All Roles</option>
              <option value="super_admin">Admin / Super Admin</option>
              <option value="department">Department</option>
              <option value="content">Content</option>
            </Select>

            {/* Module Filter */}
            <Select
              value={moduleFilter}
              onChange={(e) => {
                setModuleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 text-xs border bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white dark:text-gray-200 rounded-md px-3"
            >
              <option value="all">All Modules</option>
              <option value="user">User & Roles</option>
              <option value="banner">Home Banner</option>
              <option value="faculty">Faculty</option>
              <option value="academic_program">Academic Programs</option>
              <option value="certificate_course">Certificate Courses</option>
              <option value="gallery">Gallery</option>
              <option value="admission_lead">Admission Leads</option>
              <option value="contact_lead">Contact Leads</option>
              <option value="testimonial">Testimonials</option>
              <option value="award">Awards & Certificates</option>
              <option value="auth">Auth & Login</option>
            </Select>

            {/* Action Filter */}
            <Select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 text-xs border bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white dark:text-gray-200 rounded-md px-3"
            >
              <option value="all">All Actions</option>
              <option value="CREATE">CREATE</option>
              <option value="UPDATE">UPDATE</option>
              <option value="DELETE">DELETE</option>
              <option value="LOGIN">LOGIN</option>
            </Select>

            {/* Date Range Picker */}
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

            {/* Ascending / Descending Toggle */}
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

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleResetAll}
              disabled={isRefreshing || loading}
              className="bg-red-700 hover:bg-red-800 active:scale-95 text-white h-10 w-10 rounded-md flex items-center justify-center transition-all duration-200 focus:outline-none shadow-xs hover:shadow-md cursor-pointer shrink-0 disabled:opacity-75"
              title="Reset Filters"
            >
              <FiRotateCw
                size={15}
                className={"text-white transition-transform duration-500 " + (isRefreshing ? "animate-spin" : "hover:rotate-45")}
              />
            </button>

            {/* Export CSV Button */}
            <CSVDownloader
              data={exportData}
              filename={`activity_logs_${new Date().toISOString().slice(0, 10)}`}
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

      {/* Table Section */}
      {logsList && logsList.length > 0 ? (
        <TableContainer className="mb-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xs">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>Sr. No.</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Module</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>IP Address</TableCell>
              </tr>
            </TableHeader>
            <ActivityLogTable
              logs={logsList}
              currentPage={currentPage}
              resultsPerPage={resultsPerPage}
              totalResults={totalResults}
              sortOrder={sortOrder}
            />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              onChange={(p) => setCurrentPage(p)}
              label="Activity Logs Navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <div className="py-12 bg-white dark:bg-gray-800 rounded-lg">
          <NotFound title="No Activity Logs Found" />
        </div>
      )}
    </>
  );
};

export default ActivityLogs;
