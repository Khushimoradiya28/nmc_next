import React, { useContext, useState, useRef } from 'react';
import {
  Table,
  TableHeader,
  TableCell,
  TableFooter,
  TableContainer,
  Card,
  CardBody,
  Button,
  Pagination,
  Input,
} from '@windmill/react-ui';
import { FiPlus } from 'react-icons/fi';

import useAsync from '../../hooks/useAsync';
import useFilter from '../../hooks/useFilter';
import NotFound from '../../components/table/NotFound';
import Loading from '../../components/preloader/Loading';
import CategoryService from '../../services/master/CategoryService';
import PageTitle from '../../components/Typography/PageTitle';
import { SidebarContext } from '../../context/SidebarContext';
import CategoryTable from '../../components/master/category/CategoryTable';
import MainDrawer from '../../components/drawer/MainDrawer';
import CategoryDrawer from '../../components/master/drawer/CategoryDrawer';
import Breadcrumb from "../../components/form/Breadcrumb";

const Brands = () => {
  const { toggleDrawer, setIsUpdate } = useContext(SidebarContext);
  const [searchText, setSearchText] = useState("");
  const { data, loading } = useAsync(() => CategoryService.getAllBrands({ search: searchText }));
  // const { data, loading } = useAsync(CategoryService.getAllBrands);
  const brandList = data?.data || [];
  const searchRef = useRef(null);

  const {
    handleChangePage,
    totalResults,
    resultsPerPage,
    dataTable,
    serviceData,
    currentPage,
  } = useFilter(brandList);

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
    setIsUpdate(true);
  };

  return (
    <>

      <MainDrawer>
        <CategoryDrawer />
      </MainDrawer>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 my-2">

        {/* Title + Breadcrumb */}
        <div className="flex flex-col text-left w-full sm:w-auto">
          <PageTitle>Categories</PageTitle>

          <Breadcrumb
            items={[
              { label: "Masters", link: "/master" },
              { label: "Categories" }
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
              placeholder="Search by Category name"
            />
          </div>

          <Button
            onClick={toggleDrawer}
            className="w-full sm:w-auto rounded-md h-10"
          >
            <span className="mr-3">
              <FiPlus />
            </span>
            Add Categories
          </Button>
        </div>

      </div>


      {loading ? (
        <Loading loading={loading} />
      ) : serviceData.length !== 0 ? (
        <TableContainer className="rounded-b-lg">
          <Table>
            <TableHeader>
              <tr>
                <TableCell className="text-center">Sr. No</TableCell>
                <TableCell className="text-center">Category Logo</TableCell>
                <TableCell className="text-center">Category Name</TableCell>
                <TableCell className="text-center">Status</TableCell>
                <TableCell className="text-center">Date</TableCell>
                <TableCell className="text-center">Actions</TableCell>
              </tr>
            </TableHeader>
            <CategoryTable brand={dataTable} currentPage={currentPage} resultsPerPage={resultsPerPage} />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              onChange={handleChangePage}
              label="Category Page Navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Category" />
      )}
    </>
  );
};

export default Brands;
