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
import TagService from '../../services/master/TagService';
import PageTitle from '../../components/Typography/PageTitle';
import { SidebarContext } from '../../context/SidebarContext';
import TagTable from '../../components/master/tag/TagTable';
import MainDrawer from '../../components/drawer/MainDrawer';
import TagDrawe from '../../components/master/drawer/TagDrawe';
import Breadcrumb from "../../components/form/Breadcrumb";

const UserRoles = () => {
  const { toggleDrawer, setIsUpdate } = useContext(SidebarContext);
  const { data, loading } = useAsync(() => TagService.getAllData({ search: searchText }));
  // const { data, loading } = useAsync(TagService.getAllData);
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
        <TagDrawe />
      </MainDrawer>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 my-2">
      
        {/* Title + Breadcrumb */}
        <div className="flex flex-col text-left w-full sm:w-auto">
          <PageTitle>Tags</PageTitle>

          <Breadcrumb
            items={[
              { label: "Masters", link: "/master" },
              { label: "Tags" }
            ]}
          />
        </div>

          {/* Search + Add Btn */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* <form onSubmit={handleSubmit} className="w-full sm:w-64"> */}
            <div className="w-full sm:w-64">
              <Input
                ref={searchRef}
                onChange={handleInputChange}
                className="block w-full px-3 py-1 text-sm dark:text-gray-300 rounded-md 
                focus:border-gray-200 border-gray-200 dark:border-gray-600 
                focus:ring focus:ring-green-300 dark:bg-gray-700 bg-gray-100 h-10 pl-4"
                type="search"
                name="search"
                placeholder="Search by Tag name"
              />
            </div>
            {/* </form> */}

            <Button
              onClick={toggleDrawer}
              className="w-full sm:w-auto rounded-md h-10"
            >
              <span className="mr-3">
                <FiPlus />
              </span>
              Add Tag
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
                <TableCell className="text-center">Tag Name</TableCell>
                {/* <TableCell>Status</TableCell> */}
                <TableCell className="text-center">Date</TableCell>
                <TableCell className="text-center">Actions</TableCell>
              </tr>
            </TableHeader>
            <TagTable brand={dataTable} currentPage={currentPage} resultsPerPage={resultsPerPage} />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              onChange={handleChangePage}
              label="Data Page Navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Tag" />
      )}
    </>
  );
};

export default UserRoles;
