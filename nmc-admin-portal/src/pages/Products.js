import React, { useContext, useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Table, TableContainer, TableFooter, Pagination, Input, Button, Card, CardBody
} from "@windmill/react-ui";
import { FiPlus, FiFilter, FiRefreshCw } from "react-icons/fi";
import { CSVReader } from "react-papaparse";

import useFilter from "../hooks/useFilter";
import useToggleDrawer from "../hooks/useToggleDrawer";
import ProductServices from "../services/ProductServices";
import TestimonialServices from "../services/TestimonialServices";
import AwardServices from "../services/AwardServices";
import CourseServices from "../services/CourseServices";
import PageTitle from "../components/Typography/PageTitle";
import { SidebarContext } from "../context/SidebarContext";
import Breadcrumb from "../components/form/Breadcrumb";
import FilterDrawer from "../components/drawer/ProductFilterDrawer";
import MainDrawer from "../components/drawer/MainDrawer";
import ProductDrawer from "../components/drawer/ProductDrawer";
import TestimonialDrawer from "../components/drawer/TestimonialDrawer";
import AwardDrawer from "../components/drawer/AwardDrawer";
import CourseDrawer from "../components/drawer/CourseDrawer";
import ProductTable from "../components/product/ProductTable";
import TestimonialTable from "../components/testimonial/TestimonialTable";
import AwardTable from "../components/award/AwardTable";
import CourseTable from "../components/course/CourseTable";
import Loading from "../components/preloader/Loading";
import NotFound from "../components/table/NotFound";
import MainModal from "../components/modal/MainModal";

const Products = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const typeParam = query.get("type");

  let pageHeading = "Home";
  if (typeParam === "testimonial") pageHeading = "Testimonial";
  else if (typeParam === "awards") pageHeading = "Awards & Certificates";
  else if (typeParam === "courses") pageHeading = "Professional Certificate Courses";

  const {
    toggleDrawer,
    isUpdate,
    setIsUpdate,
    filtertoggleDrawer,
    closefilterDrawer,
    isfilterDrawerOpen,
    setCategoryType,
  } = useContext(SidebarContext);

  const { serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();

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
      const searchVal = searchRef.current?.value || "";
      if (typeParam === "testimonial") {
        const params = {};
        if (searchVal) params.search = searchVal;
        const res = await TestimonialServices.getAllTestimonials(params);
        const list = res?.data || res?.testimonials || (Array.isArray(res) ? res : []);
        setData(Array.isArray(list) ? list : []);
      } else if (typeParam === "awards") {

        const params = {
          page: 1,
          limit: 100,
          ...payloadFilters,
        };
        if (searchVal) params.search = searchVal;
        const res = await AwardServices.getAllAwards(params);
        setData(res.data || res.awards || (Array.isArray(res) ? res : []));
      } else if (typeParam === "courses") {
        const params = {};
        if (searchVal) params.search = searchVal;
        const res = await CourseServices.getAllCourses(params);
        setData(res.data || res.courses || (Array.isArray(res) ? res : []));
      } else {
        const payload = {
          type: "product_list",
          status: 1,
          search: searchVal,
          ...payloadFilters,
        };
        const res = await ProductServices.getAllProducts(payload);
        setData(res.data || []);
      }
    } catch (err) {
      console.error(err.response || err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchProducts(filters);
  }, [filters, typeParam]);

  useEffect(() => {
    if (isUpdate) {
      fetchProducts(filters);
      setIsUpdate(false);
    }
  }, [isUpdate, filters]);


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
    setFilters((prev) => ({ ...prev, search: searchRef.current?.value }));
  };

  // Check if product filter is active
  const isProductFilterActive = Boolean(
    (Array.isArray(filters.categoryidlist) && filters.categoryidlist.length > 0) ||
      (Array.isArray(filters.brand_id) && filters.brand_id.length > 0) ||
      (Array.isArray(filters.characteridlist) && filters.characteridlist.length > 0) ||
      filters.is_stock !== null ||
      filters.sort_by ||
      filters.sort_order
  );

  const handleSort = (field) => {
    setFilters((prev) => {
      let order = "asc";
      if (prev.sort_by === field && prev.sort_order === "asc") order = "desc";
      else if (prev.sort_by === field && prev.sort_order === "desc")
        return { ...prev, sort_by: "", sort_order: "" };
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

  const getAddBtnText = () => {
    if (typeParam === "testimonial") return "Add Testimonial";
    if (typeParam === "awards") return "Add Award";
    if (typeParam === "courses") return "Add Course";
    return "Add Product";
  };

  return (
    <>
      <MainModal id={serviceId} />

      <MainDrawer>
        {typeParam === "testimonial" ? (
          <TestimonialDrawer id={serviceId} />
        ) : typeParam === "awards" ? (
          <AwardDrawer id={serviceId} />
        ) : typeParam === "courses" ? (
          <CourseDrawer id={serviceId} />
        ) : (
          <ProductDrawer id={serviceId} />
        )}
      </MainDrawer>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 my-2">
        {/* Title + Breadcrumb */}
        <div className="flex flex-col text-left w-full sm:w-auto">
          <PageTitle>{pageHeading}</PageTitle>

          <Breadcrumb
            items={[
              { label: "Dashboard", link: "/dashboard" },
              { label: "Home", link: "/products" },
              ...(typeParam ? [{ label: pageHeading }] : []),
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

          {/* Filter Button (Only for Product list, disabled/hidden for custom modules) */}
          {!["testimonial", "awards", "courses"].includes(typeParam) && (
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
          )}

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
            {getAddBtnText()}
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
            </div>
          </div>
        </CardBody>
      </Card>

      {loading ? (
        <Loading loading={loading} />
      ) : (serviceData.length !== 0 || ["testimonial", "awards", "courses"].includes(typeParam)) ? (
        <TableContainer className="mb-8 rounded-b-lg">
          <Table>
            {typeParam === "testimonial" ? (
              <TestimonialTable
                testimonials={dataTable}
                currentPage={currentPage}
                resultsPerPage={resultsPerPage}
                onEdit={handleUpdate}
                onDelete={handleModalOpen}
              />
            ) : typeParam === "awards" ? (
              <AwardTable
                awards={dataTable}
                currentPage={currentPage}
                resultsPerPage={resultsPerPage}
                onEdit={handleUpdate}
                onDelete={handleModalOpen}
              />
            ) : typeParam === "courses" ? (
              <CourseTable
                courses={dataTable}
                currentPage={currentPage}
                resultsPerPage={resultsPerPage}
                onEdit={handleUpdate}
                onDelete={handleModalOpen}
              />
            ) : (
              <ProductTable
                products={dataTable}
                currentPage={currentPage}
                resultsPerPage={resultsPerPage}
                sortBy={filters.sort_by}
                sortOrder={filters.sort_order}
                onSort={handleSort}
              />
            )}
          </Table>
          <TableFooter>
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              onChange={handleChangePage}
              label={
                typeParam === "testimonial"
                  ? "Testimonial Page Navigation"
                  : typeParam === "awards"
                  ? "Awards Page Navigation"
                  : typeParam === "courses"
                  ? "Courses Page Navigation"
                  : "Product Page Navigation"
              }
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound
          title={
            typeParam === "testimonial"
              ? "Testimonial"
              : typeParam === "awards"
              ? "Awards & Certificates"
              : typeParam === "courses"
              ? "Professional Certificate Courses"
              : "Product"
          }
        />
      )}

      {!["testimonial", "awards", "courses"].includes(typeParam) && (
        <MainDrawer
          isDrawerOpen={isfilterDrawerOpen}
          closeDrawer={closefilterDrawer}
          toggleDrawer={filtertoggleDrawer}
        >
          <FilterDrawer
            filter={filters}
            setFilter={setFilters}
            setCategoryType={setCategoryType}
            onReset={handleResetAll}
          />
        </MainDrawer>
      )}
    </>
  );
};

export default Products;
