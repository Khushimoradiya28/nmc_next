import React, { useContext, useState, useRef, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableFooter,
  TableContainer,
  Select,
  Button,
  Card,
  CardBody,
  Pagination,
  Input,
} from "@windmill/react-ui";
import { FiPlus, FiFilter, FiRefreshCw } from "react-icons/fi";
import { CSVReader, CSVDownloader } from "react-papaparse";

import useAsync from "../hooks/useAsync";
import useFilter from "../hooks/useFilter";
import NotFound from "../components/table/NotFound";
import Loading from "../components/preloader/Loading";
import MasterUserService from "../services/master/MasterUserService";
import PageTitle from "../components/Typography/PageTitle";
import { SidebarContext } from "../context/SidebarContext";
import MainDrawer from "../components/drawer/MainDrawer";
import CustomersTable from "../components/customer/CustomerTable";
import SelectCategory from "../components/form/SelectCategory";
import Breadcrumb from "../components/form/Breadcrumb";

const Customers = () => {
  const {
    closecustomersfilterDrawer,
    customersfiltertoggleDrawer,
    iscustomersfilterDrawerOpen,
    setIsUpdate,
  } = useContext(SidebarContext);
  const [filters, setFilters] = useState({
    from_date: "",
    to_date: "",
    lead_type: "",
  });

  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  // const customers = data?.data || [];

  const fetchcustomers = async (payloadFilters, search = "") => {
    setLoading(true);
    try {
      const payload = {
        search,
        ...payloadFilters,
      };
      const res = await MasterUserService.getAllCustomer(payload);
      setData(res.data || []);
    } catch (err) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchcustomers(filters, searchText);
  }, [filters, searchText]);

  const {
    handleChangePage,
    totalResults,
    resultsPerPage,
    dataTable,
    serviceData,
    currentPage,
  } = useFilter(data);

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
    setIsUpdate(true);
  };

  const isFilterApplied =
    Object.values(filters).some((val) => val !== "" && val !== null) ||
    searchText.trim() !== "";

  const handleResetAll = () => {
    const emptyFilters = {
      lead_type: "",
      from_date: "",
      to_date: "",
    };

    setFilters(emptyFilters);
    setSearchText("");

    if (searchRef.current) {
      searchRef.current.value = "";
    }

    fetchcustomers(emptyFilters, "");
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 my-2">
        {/* Title + Breadcrumb */}
        <div className="flex flex-col text-left w-full sm:w-auto">
          <PageTitle>Customers</PageTitle>

          <Breadcrumb
            items={[
              { label: "Dashboard", link: "/dashboard" },
              { label: "Customers" },
            ]}
          />
        </div>

        {/* Search + Add Btn */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="w-full sm:w-64">
            <Input
              ref={searchRef}
              onChange={handleInputChange}
              className="block w-full px-3 py-1 text-sm dark:text-gray-300 rounded-md 
                focus:border-gray-200 border-gray-200 dark:border-gray-600 
                focus:ring focus:ring-green-300 dark:bg-gray-700 bg-gray-100 h-10 pl-4"
              type="search"
              name="search"
              placeholder="Search"
            />
          </div>
        </div>
      </div>

      {/* ... (CSV Uploader Card remains here) */}

      {loading ? (
        <Loading loading={loading} />
      ) : serviceData.length !== 0 ? (
        <TableContainer className="mb-8 rounded-b-lg">
          <Table>
            <TableHeader>
              {/* === PROPER TABLE HEADERS MATCHING THE DESIGN === */}
              <tr>
                <TableCell>Order ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Total Orders</TableCell>
                <TableCell>Date</TableCell>
              </tr>
            </TableHeader>
            {/* The table body component */}
            <CustomersTable
              customers={dataTable}
              currentPage={currentPage}
              resultsPerPage={resultsPerPage}
            />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              onChange={handleChangePage}
              label="Order Page Navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Customers" />
      )}
      {/* <MainDrawer
        isDrawerOpen={iscustomersfilterDrawerOpen}
        closeDrawer={closecustomersfilterDrawer}
        toggleDrawer={customersfiltertoggleDrawer}
      ></MainDrawer> */}
    </>
  );
};

export default Customers;
