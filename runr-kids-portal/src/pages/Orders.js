import React, { useContext, useState, useRef, useEffect } from 'react';
import { useParams } from "react-router-dom";

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
} from '@windmill/react-ui';
import { FiPlus, FiFilter, FiRefreshCw } from 'react-icons/fi';
import { CSVReader, CSVDownloader } from 'react-papaparse';

import useAsync from '../hooks/useAsync';
import useFilter from '../hooks/useFilter';
import NotFound from '../components/table/NotFound';
import Loading from '../components/preloader/Loading';
import OrderServices from '../services/OrderServices';
import PageTitle from '../components/Typography/PageTitle';
import { SidebarContext } from '../context/SidebarContext';
import MainDrawer from '../components/drawer/MainDrawer';
import ProductTable from '../components/order/OrderTable';
import SelectCategory from '../components/form/SelectCategory';
import Breadcrumb from "../components/form/Breadcrumb";
import OrderFilterDrawer from '../components/drawer/OrderFilterDrawer';

const Orders = () => {
  const { id } = useParams();


  const { closeordersfilterDrawer, ordersfiltertoggleDrawer, isordersfilterDrawerOpen, setIsUpdate, isUpdate } = useContext(SidebarContext);
  // const { data, loading } = useAsync(async () => {
  //   // Note: Fetching orders based on your response and status filter
  //   const res = await OrderServices.getAllOrders({ type: "order_list", status: 1 });
  //   return res.data;
  // });

  const [filters, setFilters] = useState({
    from_date: "",
    to_date: "",
    order_status: "",
    user_id: id || null,
  });

  const [searchText, setSearchText] = useState("");
  // const { data, loading } = useAsync(() => OrderServices.getAllOrders({ search: searchText, type: "order_list", status: 1 }));
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  // const orders = data?.data || [];

  const cleanPayload = (obj) =>
    Object.fromEntries(
      Object.entries(obj).filter(
        ([_, v]) => v !== "" && v !== null && v !== undefined
      )
    );



  const fetchOrders = async (payloadFilters = {}, search = "", user_idParam = null) => {
    setLoading(true);

    try {
      const rawPayload = {
        type: "order_list",
        payment_status: ["success", "failed"],
        status: 1,
        search,
        user_id: user_idParam ?? id,
        ...payloadFilters
      };

      const payload = cleanPayload(rawPayload);

      // console.log("FINAL PAYLOAD:", payload);

      const res = await OrderServices.getAllOrders(payload);
      setData(res?.data || []);
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(filters, searchText, id);
  }, [filters, searchText, id]);

  // Handle Updates from Context
  useEffect(() => {
    if (isUpdate) {
      fetchOrders(filters, searchText, id);
      setIsUpdate(false);
    }
  }, [isUpdate, filters, searchText, id, setIsUpdate]);

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
    searchText.trim() !== "" ||
    filters.order_status !== "" ||
    filters.from_date !== "" ||
    filters.to_date !== "";

  const handleResetAll = () => {
    const emptyFilters = {
      order_status: "",
      from_date: "",
      to_date: "",
      user_id: null,
    };

    setFilters(emptyFilters);
    setSearchText("");

    if (searchRef.current) {
      searchRef.current.value = "";
    }

    fetchOrders(emptyFilters, "", id);
  };

  return (
    <>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 my-2">

        {/* Title + Breadcrumb */}
        <div className="flex flex-col text-left w-full sm:w-auto">
          <PageTitle>Orders</PageTitle>

          <Breadcrumb
            items={[
              { label: "Dashboard", link: "/dashboard" },
              { label: "Orders" }
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
          {/* Filter Button */}
          <div className="relative inline-flex">
            <Button
              onClick={ordersfiltertoggleDrawer}
              className="w-full sm:w-auto rounded-md h-10 flex items-center justify-center"
              variant="outline"
            >
              <FiFilter size={18} />
            </Button>

            {isFilterApplied && (
              <span className="absolute top-0 right-0 flex h-3 w-3 -translate-y-1/2 translate-x-1/2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
              </span>
            )}
          </div>

          <Button
            onClick={handleResetAll}
            className="w-full sm:w-auto rounded-md h-10 flex items-center justify-center"
            variant="outline"
          >
            <FiRefreshCw size={18} />
          </Button>
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
                <TableCell>Customer</TableCell>
                <TableCell>Sub Total</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Shipping Charge</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment Mode</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </tr>
            </TableHeader>
            {/* The table body component */}
            <ProductTable products={dataTable} currentPage={currentPage} resultsPerPage={resultsPerPage} />
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
        <NotFound title="Order" />
      )}
      <MainDrawer isDrawerOpen={isordersfilterDrawerOpen} closeDrawer={closeordersfilterDrawer} toggleDrawer={ordersfiltertoggleDrawer}>

        <OrderFilterDrawer
          filter={filters}
          setFilter={setFilters}   // <-- IMPORTANT
          onReset={() => setFilters({ order_status: "", from_date: "", to_date: "" })}
        />
      </MainDrawer>
    </>
  );
};

export default Orders;