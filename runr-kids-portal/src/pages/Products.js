import React, { useContext, useRef, useState, useEffect } from "react";
import {
  Table, TableContainer, TableFooter, Pagination, Input, Button, Card, CardBody
} from "@windmill/react-ui";
import { FiPlus, FiFilter, FiRefreshCw } from "react-icons/fi";
import { CSVReader } from "react-papaparse";

import useFilter from "../hooks/useFilter";
import ProductServices from "../services/ProductServices";
import PageTitle from "../components/Typography/PageTitle";
import { SidebarContext } from "../context/SidebarContext";
import Breadcrumb from "../components/form/Breadcrumb";
import FilterDrawer from "../components/drawer/ProductFilterDrawer";
import MainDrawer from "../components/drawer/MainDrawer";
import ProductDrawer from "../components/drawer/ProductDrawer";
import ProductTable from "../components/product/ProductTable";
import Loading from "../components/preloader/Loading";
import NotFound from "../components/table/NotFound";

const Products = () => {
  const { toggleDrawer, setIsUpdate, filtertoggleDrawer, closefilterDrawer, isfilterDrawerOpen, setCategoryType } = useContext(SidebarContext);

  const [filters, setFilters] = useState({
    categoryidlist: "",
    brand_id: "",
    characteridlist: "",
    is_stock: null,
    sort_by: "",
    sort_order: "",
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  const fetchProducts = async (payloadFilters) => {
    setLoading(true);
    try {
      const payload = {
        type: "product_list",
        status: 1,
        search: searchRef.current?.value || "",
        ...payloadFilters
      };
      const res = await ProductServices.getAllProducts(payload);
      setData(res.data || []);
    } catch (err) {
      console.error(err.response || err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(filters);
  }, [filters]);

  const {
    handleChangePage,
    totalResults,
    resultsPerPage,
    dataTable,
    serviceData,
    handleOnDrop,
    handleUploadProducts,
    currentPage,
  } = useFilter(data);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: searchRef.current?.value }));
  };

  // ✅ Check if product filter is active
  const isProductFilterActive = Boolean(
    (Array.isArray(filters.categoryidlist) && filters.categoryidlist.length > 0) ||
    (Array.isArray(filters.brand_id) && filters.brand_id.length > 0) ||
    (Array.isArray(filters.characteridlist) && filters.characteridlist.length > 0) ||
    filters.is_stock !== null ||
    filters.sort_by ||
    filters.sort_order
  );

  const handleSort = (field) => {
    setFilters(prev => {
      let order = "asc";
      if (prev.sort_by === field && prev.sort_order === "asc") order = "desc";
      else if (prev.sort_by === field && prev.sort_order === "desc") return { ...prev, sort_by: "", sort_order: "" };
      return { ...prev, sort_by: field, sort_order: order };
    });
  };

   const handleResetAll = () => {
    const resetFilter = {
      categoryidlist: "",
      brand_id: "",
      characteridlist: "",
      is_stock: null,
      sort_by: "",
      sort_order: "",
    };
    setFilters(resetFilter);
    if (searchRef.current) searchRef.current.value = "";
    fetchProducts(resetFilter);
  };


  return (
    <>
      {/* <PageTitle>Products</PageTitle> */}
      <MainDrawer>
        <ProductDrawer />
      </MainDrawer>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 my-2">
        {/* Title + Breadcrumb */}
        <div className="flex flex-col text-left w-full sm:w-auto">
          <PageTitle>Products</PageTitle>

          <Breadcrumb
            items={[
              { label: "Dashboard", link: "/dashboard" },
              { label: "Products" },
            ]}
          />
        </div>

        {/* Search + Add Btn */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <form onSubmit={handleSubmit} className="w-full sm:w-64">
            <Input
              ref={searchRef}
              className="block w-full px-3 py-1 text-sm dark:text-gray-300 rounded-md 
              focus:border-gray-200 border-gray-200 dark:border-gray-600 
              focus:ring focus:ring-green-300 dark:bg-gray-700 bg-gray-100 h-10 pl-4"
              type="search"
              name="search"
              placeholder="Search"
            />
          </form>
          {/* Filter Button
          <Button
            onClick={filtertoggleDrawer}
            className="w-full sm:w-auto rounded-md h-10 flex items-center justify-center"
            variant="outline"
          >
            <FiFilter size={18} />
          </Button> */}

          {/* Filter Button */}
          <div className="relative inline-flex">
            <Button
              onClick={filtertoggleDrawer}
              className="w-full sm:w-auto rounded-md h-10 flex items-center justify-center"
              variant="outline"
            >
              <FiFilter size={18} />
            </Button>

            {isProductFilterActive && (
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


          <Button
            onClick={toggleDrawer}
            className="w-full sm:w-auto rounded-md h-10"
          >
            <span className="mr-3">
              <FiPlus />
            </span>
            Add Product
          </Button>
        </div>
      </div>
      <Card className="hidden min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 rounded-t-lg rounded-0">
        <CardBody>
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-3">
            <div className="col-span-2">
              <CSVReader
                onDrop={handleOnDrop}
                addRemoveButton
                config={{
                  header: true,
                }}
                style={{
                  dropArea: {
                    borderColor: "green",
                    borderRadius: 6,
                    borderWidth: 1,
                    height: "3em",
                    padding: "0 0.2em",
                  },
                  dropAreaActive: {
                    borderColor: "green",
                  },
                  dropFile: {
                    width: "100%",
                    display: "block",
                    height: "auto",
                    background: "none",
                    borderRadius: 6,
                    padding: "0.2em 0.2em",
                  },
                  fileSizeInfo: {
                    color: "#fff",
                    backgroundColor: "#000",
                    borderRadius: 0,
                    lineHeight: 1,
                    fontSize: 12,
                    marginBottom: "0.5em",
                    padding: "0.3em 0.2em",
                  },
                  fileNameInfo: {
                    color: "#757575",
                    backgroundColor: "transparent",
                    borderRadius: 1,
                    fontSize: 14,
                    lineHeight: 1,
                    padding: "0 0.4em",
                  },
                  removeButton: {
                    color: "red",
                  },
                  progressBar: {
                    backgroundColor: "green",
                  },
                }}
              >
                <span className="text-sm text-gray-500">Drop CSV file</span>
              </CSVReader>
            </div>
            <div className="flex items-center">
              <Button onClick={handleUploadProducts} layout="outline">
                Upload
              </Button>
              {/* <div className="w-full">
                <CSVDownloader data={productData} filename={'products'}>
                  <Button className="w-full h-12">Download</Button>
                </CSVDownloader>
              </div> */}
            </div>
          </div>
        </CardBody>
      </Card>

      {loading ? (
        <Loading loading={loading} />
      ) : serviceData.length !== 0 ? (
        <TableContainer className="mb-8 rounded-b-lg">
          <Table>
            <ProductTable
              products={dataTable}
              currentPage={currentPage}
              resultsPerPage={resultsPerPage}
              sortBy={filters.sort_by}       // ✅ from filters
              sortOrder={filters.sort_order} // ✅ from filters
              onSort={handleSort}
            />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              onChange={handleChangePage}
              label="Product Page Navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Product" />
      )}
      <MainDrawer isDrawerOpen={isfilterDrawerOpen} closeDrawer={closefilterDrawer} toggleDrawer={filtertoggleDrawer}>
        {/* <FilterDrawer
          setFilter={applyFilters}
          setCategoryType={setCategoryType}
          filter={filters}
          onReset={resetFilters}
        /> */}
        <FilterDrawer
          filter={filters}
          setFilter={setFilters}   // <-- IMPORTANT
          setCategoryType={setCategoryType}
          onReset={handleResetAll}
        />
      </MainDrawer>
    </>
  );
};

export default Products;
