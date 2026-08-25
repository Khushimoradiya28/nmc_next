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

import useAsync from "../hooks/useAsync";
import useFilter from "../hooks/useFilter";
import NotFound from "../components/table/NotFound";
import Loading from "../components/preloader/Loading";
import ProductStockServices from "../services/ProductStockServices";
import PageTitle from "../components/Typography/PageTitle";
import { notifyError, notifySuccess } from "../utils/toast";
import StockManagementTable from "../components/stockmanagement/StockManagementTable";
import Breadcrumb from "../components/form/Breadcrumb";

const StockManagement = () => {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  /* ================= FETCH STOCK ================= */
  const fetchStock = async (search = "") => {
    setLoading(true);
    try {
      const payload = { search };
      const res = await ProductStockServices.getAllStockProduct(payload);
      setData(res.data || []);
    } catch (err) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock(searchText);
  }, [searchText]);

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
  };

  /* ================= UPDATE STOCK (LIKE PRICE) ================= */
  const handleUpdateStock = async ({ id, stock_quantity }) => {
    try {
      const payload = {
        id,
        stock_quantity,
      };

      const res = await ProductStockServices.UpdateStockProduct(payload);

      if (res?.status === 200) {
        notifySuccess(res.message || "Stock updated successfully");

        // ✅ Update local table data (NO refetch, SAME AS PRICE)
        setData((prev) =>
          prev.map((item) =>
            item._id === id
              ? {
                ...item,
                stock_quantity: res.data.stock_quantity,
                is_stock: res.data.is_stock,
              }
              : item
          )
        );
      } else {
        notifyError("Failed to update stock");
      }
    } catch (error) {
      console.error("Update stock error:", error);
      notifyError(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 my-2">
        {/* Title + Breadcrumb */}
        <div className="flex flex-col text-left w-full sm:w-auto">
          <PageTitle>Stock Management</PageTitle>

          <Breadcrumb
            items={[
              { label: "Dashboard", link: "/dashboard" },
              { label: "Stock Management" },
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
                <TableCell>ID</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell className="w-50 text-center">SKU</TableCell>
                <TableCell>Stock Status</TableCell>
                <TableCell>Current Stock</TableCell>
                <TableCell>Actions</TableCell>
              </tr>
            </TableHeader>
            {/* The table body component */}
            <StockManagementTable
              StockManagement={dataTable}
              currentPage={currentPage}
              resultsPerPage={resultsPerPage}
              onUpdateStock={handleUpdateStock}
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
        <NotFound title="Stock" />
      )}
      {/* <MainDrawer
        isDrawerOpen={iscustomersfilterDrawerOpen}
        closeDrawer={closecustomersfilterDrawer}
        toggleDrawer={customersfiltertoggleDrawer}
      ></MainDrawer> */}
    </>
  );
};

export default StockManagement;
