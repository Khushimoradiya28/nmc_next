import React, { useContext } from 'react';
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
} from '@windmill/react-ui';
import { FiPlus } from 'react-icons/fi';

import useAsync from '../hooks/useAsync';
import useFilter from '../hooks/useFilter';
import NotFound from '../components/table/NotFound';
import Loading from '../components/preloader/Loading';
import CouponServices from '../services/CouponServices';
import PageTitle from '../components/Typography/PageTitle';
import { SidebarContext } from '../context/SidebarContext';
import CouponTable from '../components/coupon/CouponTable';
import MainDrawer from '../components/drawer/MainDrawer';
import CouponDrawer from '../components/drawer/CouponDrawer';

const Coupons = () => {
  const { toggleDrawer } = useContext(SidebarContext);
  const { data, loading } = useAsync(CouponServices.getAllBrands);
  const brandList = data?.data || [];

  const {
    handleChangePage,
    totalResults,
    resultsPerPage,
    dataTable,
    serviceData,
    handleSubmitForAll,
  } = useFilter(brandList);

  return (
    <>
      <PageTitle>Coupon</PageTitle>
      <MainDrawer>
        <CouponDrawer />
      </MainDrawer>

      <Card>
        <CardBody>
          <form
            onSubmit={handleSubmitForAll}
            className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex">
            {/* <div className="hidden flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <Input
                ref={searchRef}
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                type="search"
                name="search"
                placeholder="Search by product name"/>
              <button
                type="submit"
                className="absolute right-0 top-0 mt-5 mr-1"></button>
            </div>
            <div className="hidden flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <Select
                onChange={(e) => setSortedField(e.target.value)}
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white">
                <option value="All" defaultValue hidden>
                  Price
                </option>
                <option value="Low">Low to High</option>
                <option value="High">High to Low</option>
              </Select>
            </div> */}
            <div className="w-full flex justify-end">
              <Button onClick={toggleDrawer} className="w-full md:w-40 lg:w-40 xl:w-40 rounded-md h-10">
                <span className="mr-3">
                  <FiPlus />
                </span>
                Add Coupon
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>


      {loading ? (
        <Loading loading={loading} />
      ) : serviceData.length !== 0 ? (
        <TableContainer className="mb-8 rounded-b-lg">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>Sr. No</TableCell>
                <TableCell>Coupon Code</TableCell>
                <TableCell>Discount Type</TableCell>
                <TableCell>Coupon Amount</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </tr>
            </TableHeader>
            <CouponTable brand={dataTable} />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              onChange={handleChangePage}
              label="Coupon Page Navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Coupon" />
      )}
    </>
  );
};

export default Coupons;
