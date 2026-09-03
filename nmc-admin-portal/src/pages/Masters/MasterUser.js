import React, { useContext, useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableCell,
  TableFooter,
  TableContainer,
  Pagination,
  Input,
  Button,
} from '@windmill/react-ui';
import { FiPlus, FiSearch } from 'react-icons/fi';

import NotFound from '../../components/table/NotFound';
import Loading from '../../components/preloader/Loading';
import MasterUserService from '../../services/master/MasterUserService';
import PageTitle from '../../components/Typography/PageTitle';
import { SidebarContext } from '../../context/SidebarContext';
import MasterUserTable from '../../components/master/masteruser/MasterUserTable';
import MainDrawer from '../../components/drawer/MainDrawer';
import MasterUserDrawer from '../../components/master/drawer/MasterUserDrawer';
import Breadcrumb from '../../components/form/Breadcrumb';
import { notifyError } from '../../utils/toast';

const MasterUser = () => {
  const { toggleDrawer, isUpdate, setIsUpdate } = useContext(SidebarContext);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const resultsPerPage = 8;

  // Direct, reliable API fetch without fragile legacy useFilter hook
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await MasterUserService.getAllBrands({
        page: currentPage,
        limit: resultsPerPage,
        search: searchText,
        status: 'all',
      });

      if (res && res.data) {
        setUsersList(res.data);
        setTotalResults(res.meta?.total_records || res.data.length);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
      notifyError(err?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Fetch when page, search or isUpdate changes
  useEffect(() => {
    fetchUsers();
    if (isUpdate) {
      setIsUpdate(false);
    }
  }, [currentPage, isUpdate]);

  // Live debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 my-2">
        {/* Title + Breadcrumb */}
        <div className="flex flex-col text-left w-full sm:w-auto">
          <PageTitle>Users</PageTitle>
          <Breadcrumb
            items={[
              { label: 'Masters', link: '/master' },
              { label: 'Users' },
            ]}
          />
        </div>

        {/* Search + Add User Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Input
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
              className="border h-10 text-xs focus:outline-none block w-full bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white dark:text-gray-200 rounded-md pl-10 pr-4"
              type="search"
              placeholder="Search by name, email or mobile..."
            />
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={14}
            />
          </div>

          <Button
            onClick={toggleDrawer}
            className="bg-red-700 hover:bg-red-800 text-white rounded-md text-xs font-semibold h-10 px-4 flex items-center justify-center gap-2 transition-colors shrink-0 shadow-xs cursor-pointer"
          >
            <FiPlus size={16} />
            <span>Add User</span>
          </Button>
        </div>
      </div>

      {loading ? (
        <Loading loading={loading} />
      ) : usersList && usersList.length > 0 ? (
        <TableContainer className="mb-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xs">
          <Table>
            <TableHeader>
              <tr>
                <TableCell className="text-center">Sr. No</TableCell>
                <TableCell className="text-center">User Image</TableCell>
                <TableCell className="text-center">Name</TableCell>
                <TableCell className="text-center">Information</TableCell>
                <TableCell className="text-center">User Role</TableCell>
                <TableCell className="text-center">Status</TableCell>
                <TableCell className="text-center">Date</TableCell>
                <TableCell className="text-center">Actions</TableCell>
              </tr>
            </TableHeader>
            <MasterUserTable
              brand={usersList}
              currentPage={currentPage}
              resultsPerPage={resultsPerPage}
            />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              onChange={(p) => setCurrentPage(p)}
              label="User Page Navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <div className="py-12 bg-white dark:bg-gray-800 rounded-lg">
          <NotFound title="No Users Found" />
        </div>
      )}
    </>
  );
};

export default MasterUser;
