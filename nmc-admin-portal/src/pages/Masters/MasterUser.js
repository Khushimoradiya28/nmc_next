import React, { useContext, useRef, useState } from 'react';
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
import MasterUserService from '../../services/master/MasterUserService';
import PageTitle from '../../components/Typography/PageTitle';
import { SidebarContext } from '../../context/SidebarContext';
import MasterUserTable from '../../components/master/masteruser/MasterUserTable';
import MainDrawer from '../../components/drawer/MainDrawer';
import MasterUserDrawer from '../../components/master/drawer/MasterUserDrawer';
import Breadcrumb from "../../components/form/Breadcrumb";
const Brands = () => {
  const { toggleDrawer, setIsUpdate } = useContext(SidebarContext);
  const { data, loading } = useAsync(() => MasterUserService.getAllBrands({ search: searchText }));
  const brandList = data?.data || [];
  const searchRef = useRef(null);
  const [searchText, setSearchText] = useState("");

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
        <MasterUserDrawer />
      </MainDrawer>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 my-2">

        {/* Title + Breadcrumb */}
        <div className="flex flex-col text-left w-full sm:w-auto">
          <PageTitle>Users</PageTitle>

          <Breadcrumb
            items={[
              { label: "Masters", link: "/master" },
              { label: "Users" }
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
              placeholder="Search by User name"
            />
          </div>

          <Button
            onClick={toggleDrawer}
            className="w-full sm:w-auto rounded-md h-10"
          >
            <span className="mr-3">
              <FiPlus />
            </span>
            Add User
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
                <TableCell className="text-center">User Image</TableCell>
                <TableCell className="text-center">Name</TableCell>
                <TableCell className="text-center">Information</TableCell>
                <TableCell className="text-center">User Role</TableCell>
                {/* <TableCell>Status</TableCell>                 */}
                <TableCell className="text-center">Date</TableCell>
                <TableCell className="text-center">Actions</TableCell>
              </tr>
            </TableHeader>
            <MasterUserTable brand={dataTable} currentPage={currentPage} resultsPerPage={resultsPerPage}/>
          </Table>
          <TableFooter>
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              onChange={handleChangePage}
              label="User Page Navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="User" />
      )}
    </>
  );
};

export default Brands;
