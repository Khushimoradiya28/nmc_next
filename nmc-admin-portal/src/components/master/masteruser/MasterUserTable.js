import React, { useEffect, useState, useContext } from 'react';
import { TableCell, TableBody, TableRow } from '@windmill/react-ui';
import { FiLock } from 'react-icons/fi';
import { BsToggleOn, BsToggleOff } from 'react-icons/bs';

import MainModal from '../../modal/MainModal';
import MainDrawer from '../../drawer/MainDrawer';
import MasterUserDrawer from '../drawer/MasterUserDrawer';
import EditDeleteButton from '../../table/EditDeleteButton';
import Tooltip from '../../tooltip/Tooltip';
import useToggleDrawer from '../../../hooks/useToggleDrawer';
import DateBox from '../../form/DateBox';
import MasterUserPasswordDrawer from '../drawer/MasterUserPasswordDrawer';
import LetterAvatar from '../../common/LetterAvatar';
import MasterUserService from '../../../services/master/MasterUserService';
import { SidebarContext } from '../../../context/SidebarContext';
import { notifySuccess, notifyError } from '../../../utils/toast';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

const resolveImageUrl = (rawImg) => {
  if (!rawImg || typeof rawImg !== 'string' || rawImg.trim() === '') return null;
  if (rawImg.startsWith('http://') || rawImg.startsWith('https://') || rawImg.startsWith('blob:')) {
    return rawImg;
  }
  const backendBase = (
    process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
  ).replace(/\/api\/?$/, '');

  return `${backendBase}/${rawImg.replace(/^\//, '')}`;
};

const UserAvatarCell = ({ src, name }) => {
  const [hasError, setHasError] = useState(false);
  const resolved = resolveImageUrl(src);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!resolved || hasError) {
    return <LetterAvatar name={name} size={42} />;
  }

  return (
    <div className="relative inline-block w-11 h-11 rounded-full overflow-hidden shadow-xs border border-gray-100 dark:border-gray-700">
      <a data-fancybox href={resolved}>
        <img
          src={resolved}
          alt={name}
          className="object-cover w-full h-full cursor-pointer hover:scale-105 transition-transform"
          onError={() => setHasError(true)}
        />
      </a>
    </div>
  );
};

const BrandTable = ({ brand = [], currentPage = 1, resultsPerPage = 10 }) => {
  const { serviceId, drawerView, handleModalOpen, handleUpdate, handlePasswordDrawer } = useToggleDrawer();
  const { setIsUpdate } = useContext(SidebarContext);
  const [userList, setUserList] = useState(brand);

  useEffect(() => {
    setUserList(brand);
  }, [brand]);

  const startIndex = (currentPage - 1) * resultsPerPage;

  const getRoleBadge = (roleName) => {
    const r = (roleName || '').toLowerCase().trim();
    if (r === 'super_admin' || r === 'admin' || r === 'super admin') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800/50">
          Admin
        </span>
      );
    }
    if (r === 'department') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
          Department
        </span>
      );
    }
    if (r === 'content') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
          Content
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 capitalize">
        {roleName || '-'}
      </span>
    );
  };

  useEffect(() => {
    Fancybox.bind('[data-fancybox]', {});
    return () => {
      Fancybox.unbind('[data-fancybox]');
      Fancybox.close();
    };
  }, []);

  const handleToggleStatus = async (item) => {
    const id = item._id || item.id;
    const currentStatus = String(item.status || '1');
    const newStatus = currentStatus === '1' || currentStatus === 'active' ? '0' : '1';

    try {
      const res = await MasterUserService.updateStatus(id, newStatus);
      if (res && (res.status === 200 || res.success)) {
        setUserList((prev) =>
          prev.map((u) => ((u._id || u.id) === id ? { ...u, status: newStatus } : u))
        );
        notifySuccess(`User status updated to ${newStatus === '1' ? 'Active' : 'Inactive'}!`);
        setIsUpdate(true);
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
      notifyError(err?.response?.data?.message || err?.message || 'Failed to update status');
    }
  };

  return (
    <>
      <MainModal id={serviceId} />

      {/* Main Drawer */}
      <MainDrawer>
        {drawerView === 'USER' && <MasterUserDrawer id={serviceId} />}
        {drawerView === 'PASSWORD' && <MasterUserPasswordDrawer userId={serviceId} />}
      </MainDrawer>

      <TableBody>
        {userList?.map((item, i) => {
          const fullName = `${item.first_name || ''} ${item.last_name || ''}`.trim() || 'User';
          const avatarSrc =
            item.profile_img_webp_url ||
            item.profile_img_url ||
            item.image ||
            item.profile_img_webp ||
            item.profile_img;
          const isActive = String(item.status) === '1' || item.status === 'active' || item.status === true;

          return (
            <TableRow key={item._id || i}>
              {/* 1. Sr. No */}
              <TableCell className="text-center">
                <span className="text-xs uppercase font-semibold">{startIndex + i + 1}</span>
              </TableCell>

              {/* 2. User Image / Letter Avatar */}
              <TableCell className="text-center">
                <div className="flex items-center justify-center">
                  <UserAvatarCell src={avatarSrc} name={fullName} />
                </div>
              </TableCell>

              {/* 3. Name */}
              <TableCell className="text-center">
                <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">{fullName}</h2>
              </TableCell>

              {/* 4. Information */}
              <TableCell className="text-center">
                <h2 className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  <span className="block font-semibold text-gray-800 dark:text-gray-200">{item.email}</span>
                  <span>{item.mobile || '-'}</span>
                </h2>
              </TableCell>

              {/* 5. User Role */}
              <TableCell className="text-center">
                {getRoleBadge(item.role_name || item.role?.role_name)}
              </TableCell>

              {/* 6. Active / Inactive Toggle Switch */}
              <TableCell className="text-center">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(item)}
                  className="cursor-pointer text-2xl inline-flex items-center justify-center focus:outline-none transition-transform active:scale-95"
                  title={isActive ? 'Deactivate User' : 'Activate User'}
                >
                  {isActive ? (
                    <BsToggleOn className="text-red-700 hover:text-red-800" />
                  ) : (
                    <BsToggleOff className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </TableCell>

              {/* 7. Date */}
              <TableCell>
                <div className="flex justify-center">
                  <DateBox created_at={item.created_at} updated_at={item.updated_at} />
                </div>
              </TableCell>

              {/* 8. Actions */}
              <TableCell className="text-center">
                <div className="flex justify-center space-x-3">
                  <div
                    onClick={() => handlePasswordDrawer(item._id)}
                    className="p-2 cursor-pointer text-gray-400 hover:text-red-800 dark:hover:text-amber-400 transition-colors"
                  >
                    <Tooltip id="password" Icon={FiLock} title="Update Password" bgColor="#991b1b" />
                  </div>
                  <EditDeleteButton id={item._id} handleUpdate={handleUpdate} handleModalOpen={handleModalOpen} />
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </>
  );
};

export default React.memo(BrandTable);
