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
import ColorService from '../../services/master/ColorService';
import PageTitle from '../../components/Typography/PageTitle';
import { SidebarContext } from '../../context/SidebarContext';
import ColorTable from '../../components/master/color/ColorTable';
import MainDrawer from '../../components/drawer/MainDrawer';
import ColorDrawe from '../../components/master/drawer/ColorDrawe';
import Breadcrumb from "../../components/form/Breadcrumb";

const Color = () => {
  const { toggleDrawer, setIsUpdate } = useContext(SidebarContext);
  const { data, loading } = useAsync(() => ColorService.getAllData({ search: searchText }));
  // const { data, loading } = useAsync(ColorService.getAllData);
  const brandList = data?.data || [];
  const [searchText, setSearchText] = useState("");
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
        <ColorDrawe />
      </MainDrawer>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 my-2">

        {/* Title + Breadcrumb */}
        <div className="flex flex-col text-left w-full sm:w-auto">
          <PageTitle>Colors</PageTitle>

          <Breadcrumb
            items={[
              { label: "Masters", link: "/master" },
              { label: "Colors" }
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
              placeholder="Search by Color name"
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
            Add Color
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
                <TableCell className="text-center">Color Name</TableCell>
                <TableCell className="text-center">Color Code</TableCell>
                <TableCell className="text-center">Date</TableCell>
                <TableCell className="text-center">Actions</TableCell>
              </tr>
            </TableHeader>
            <ColorTable brand={dataTable} currentPage={currentPage} resultsPerPage={resultsPerPage} />
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
        <NotFound title="Color" />
      )}
    </>
  );
};

export default Color;
