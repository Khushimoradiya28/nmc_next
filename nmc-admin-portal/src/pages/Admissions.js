import React, { useState, useRef, useMemo, useContext } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableFooter,
  TableContainer,
  Button,
  Pagination,
  Input,
} from "@windmill/react-ui";
import {
  FiRefreshCw,
  FiUpload,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import { CSVDownloader } from "react-papaparse";

import useFilter from "../hooks/useFilter";
import mockAdmissions from "../utils/mockAdmissions";
import NotFound from "../components/table/NotFound";
import PageTitle from "../components/Typography/PageTitle";
import AdmissionTable from "../components/admission/AdmissionTable";
import Breadcrumb from "../components/form/Breadcrumb";
import CustomDateRangePicker from "../components/form/CustomDateRangePicker";
import MainModal from "../components/modal/MainModal";
import { SidebarContext } from "../context/SidebarContext";
import { notifySuccess } from "../utils/toast";

const Admissions = () => {
  const { toggleModal } = useContext(SidebarContext);

  const [admissionsList, setAdmissionsList] = useState(mockAdmissions);
  const [deleteItemId, setDeleteItemId] = useState(null);

  const [filters, setFilters] = useState({
    from_date: "",
    to_date: "",
  });
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // "desc" | "asc"

  const searchRef = useRef(null);

  // Open Delete MainModal
  const handleOpenDeleteModal = (id) => {
    setDeleteItemId(id);
    toggleModal();
  };

  // Perform Delete Callback
  const handleConfirmDelete = (id) => {
    setAdmissionsList((prev) => prev.filter((item) => (item._id || item.id) !== id));
    notifySuccess("Admission lead deleted successfully!");
  };

  // Filter & Sort admissions locally
  const filteredAndSortedAdmissions = useMemo(() => {
    let result = [...admissionsList];

    // 1. Search Filter (matches all form fields)
    if (searchText.trim()) {
      const term = searchText.toLowerCase().trim();
      result = result.filter((item) => {
        const name = (item.fullName || "").toLowerCase();
        const email = (item.email || "").toLowerCase();
        const mobile = (item.mobile || "").toLowerCase();
        const city = (item.cityVillage || "").toLowerCase();
        const course = (item.course || "").toLowerCase();
        const qual = (item.qualification || "").toLowerCase();

        return (
          name.includes(term) ||
          email.includes(term) ||
          mobile.includes(term) ||
          city.includes(term) ||
          course.includes(term) ||
          qual.includes(term)
        );
      });
    }

    // 2. From Date & To Date Filter
    if (filters.from_date) {
      const fromTimestamp = new Date(filters.from_date).setHours(0, 0, 0, 0);
      result = result.filter((item) => {
        const itemTime = new Date(item.created_at || item.createdAt || 0).getTime();
        return itemTime >= fromTimestamp;
      });
    }

    if (filters.to_date) {
      const toTimestamp = new Date(filters.to_date).setHours(23, 59, 59, 999);
      result = result.filter((item) => {
        const itemTime = new Date(item.created_at || item.createdAt || 0).getTime();
        return itemTime <= toTimestamp;
      });
    }

    // 3. Ascending / Descending Date Sorting
    result.sort((a, b) => {
      const timeA = new Date(a.created_at || a.createdAt || 0).getTime();
      const timeB = new Date(b.created_at || b.createdAt || 0).getTime();
      return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [admissionsList, searchText, filters, sortOrder]);

  const {
    handleChangePage,
    totalResults,
    resultsPerPage,
    dataTable,
    serviceData,
    currentPage,
  } = useFilter(filteredAndSortedAdmissions);

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const handleResetAll = () => {
    setFilters({ from_date: "", to_date: "" });
    setSearchText("");
    setSortOrder("desc");

    if (searchRef.current) {
      searchRef.current.value = "";
    }
  };

  const exportData = filteredAndSortedAdmissions.map((item, index) => ({
    "Sr No": index + 1,
    "Full Name": item.fullName || "",
    "Mobile Number": item.mobile || "",
    "Email Address": item.email || "",
    "Date of Birth": item.dob || "",
    Gender: item.gender || "",
    "City / Village": item.cityVillage || "",
    "Course Interested In": item.course || "",
    "Last Qualification": item.qualification || "",
    "Submitted Date": item.created_at || item.createdAt || "",
  }));

  return (
    <>
      {/* Header & Controls Bar (Identical to Leads page) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 my-2">
        {/* Title + Breadcrumb */}
        <div className="flex flex-col text-left w-full sm:w-auto">
          <PageTitle>Admission Leads</PageTitle>
          <Breadcrumb
            items={[
              { label: "Dashboard", link: "/dashboard" },
              { label: "Admission Leads" },
            ]}
          />
        </div>

        {/* Inline Search, Date Range Inputs, Sort & Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Global Search Bar */}
          <div className="w-full sm:w-48 lg:w-56">
            <Input
              ref={searchRef}
              onChange={handleInputChange}
              className="block w-full px-3 py-1 text-sm dark:text-gray-300 rounded-md 
                focus:border-gray-200 border-gray-200 dark:border-gray-600 
                focus:ring focus:ring-red-300 dark:bg-gray-700 bg-gray-100 h-10 pl-3"
              type="search"
              name="search"
              placeholder="Search admission leads..."
            />
          </div>

          {/* Custom Reusable Date Range Picker */}
          <CustomDateRangePicker
            fromDate={filters.from_date}
            toDate={filters.to_date}
            onFromDateChange={(val) => setFilters((prev) => ({ ...prev, from_date: val }))}
            onToDateChange={(val) => setFilters((prev) => ({ ...prev, to_date: val }))}
          />

          {/* Ascending / Descending Date Sort Toggle */}
          <Button
            onClick={toggleSortOrder}
            className="rounded-md h-10 px-3 flex items-center justify-center gap-1 text-sm font-semibold"
            variant="outline"
            title={`Sort Date ${sortOrder === "desc" ? "Descending (Newest First)" : "Ascending (Oldest First)"}`}
          >
            {sortOrder === "desc" ? (
              <>
                <FiArrowDown size={14} className="text-white" />
                <span className="text-[14px]">Newest</span>
              </>
            ) : (
              <>
                <FiArrowUp size={14} className="text-white" />
                <span className="text-[14px]">Oldest</span>
              </>
            )}
          </Button>

          {/* Reset Search & Date Filters */}
          <Button
            onClick={handleResetAll}
            className="rounded-md h-10 px-3 flex items-center justify-center"
            variant="outline"
            title="Reset Search & Filters"
          >
            <FiRefreshCw size={16} />
          </Button>

          {/* Export CSV */}
          <CSVDownloader
            data={exportData}
            filename={`admission_leads_${new Date().toISOString().slice(0, 10)}`}
          >
            <Button
              className="rounded-md h-10 px-3 flex items-center justify-center"
              variant="outline"
              disabled={!exportData.length}
              title="Export CSV"
            >
              <FiUpload size={16} />
            </Button>
          </CSVDownloader>
        </div>
      </div>

      {/* Main Table Container */}
      {serviceData.length !== 0 ? (
        <TableContainer className="mb-8 rounded-b-lg">
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
              admissions={dataTable}
              currentPage={currentPage}
              resultsPerPage={resultsPerPage}
              onDelete={handleOpenDeleteModal}
            />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              onChange={handleChangePage}
              label="Admission Leads Navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Admission Lead" />
      )}

      {/* Common Project Delete Modal */}
      <MainModal id={deleteItemId} onDeleteConfirm={handleConfirmDelete} />
    </>
  );
};

export default Admissions;
