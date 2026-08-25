import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TableCell,
  TableBody,
  TableRow,
} from '@windmill/react-ui';
import { FiLock } from 'react-icons/fi';

import MainModal from '../../modal/MainModal';
import MainDrawer from '../../drawer/MainDrawer';
import MasterUserDrawer from '../drawer/MasterUserDrawer';
import EditDeleteButton from '../../table/EditDeleteButton';
import Tooltip from '../../tooltip/Tooltip';
import useToggleDrawer from '../../../hooks/useToggleDrawer';
import DateBox from '../../form/DateBox';
import MasterUserPasswordDrawer from '../drawer/MasterUserPasswordDrawer';
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

const BrandTable = ({ brand, currentPage = 1, resultsPerPage = 10 }) => {
  const { serviceId, drawerView, handleModalOpen, handleUpdate, handlePasswordDrawer } = useToggleDrawer();

  // Calculate the starting index for the current page
  const startIndex = (currentPage - 1) * resultsPerPage;

  useEffect(() => {
    Fancybox.bind("[data-fancybox]", {
      // Your custom options
      // Example:
      // dragToClose: false,
    });

    return () => {
      Fancybox.unbind("[data-fancybox]");
      Fancybox.close();
    };
  }, []);

  return (
    <>
      <MainModal id={serviceId} />
      {/* <MainDrawer>
        <MasterUserDrawer id={serviceId} />
      </MainDrawer> */}

      {/* Main Drawer */}
      <MainDrawer>
        {drawerView === "USER" && <MasterUserDrawer id={serviceId} />}
        {drawerView === "PASSWORD" && <MasterUserPasswordDrawer userId={serviceId} />}
      </MainDrawer>

      <TableBody>
        {brand?.filter((item) => item.status == 1)
          .map((item, i) => (
            <TableRow key={i}>
              <TableCell className="text-center">
                <span className="text-xs uppercase font-semibold">
                  {startIndex + i + 1}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center">
                  <div className="relative inline-block w-12 h-12">
                    <a
                      data-fancybox
                      href={item.profile_img}
                    >
                      <img
                        src={item.profile_img}
                        alt={item.first_name}
                        className="object-cover w-full h-full"
                      />
                    </a>
                    <div className="absolute inset-0 shadow-inner pointer-events-none"></div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <h2 className="text-sm font-medium">{item.first_name} {item.last_name}</h2>
              </TableCell>
              <TableCell className="text-center">
                <h2 className="text-sm font-medium">
                  {item.email}
                  <br />
                  {item.mobile}
                </h2>
              </TableCell>
              <TableCell className="text-center">
                <h2 className="text-sm font-medium"> {item.role_name || "-"}</h2>
              </TableCell>
              {/* <TableCell>
              <h2 className="text-sm font-medium">
                {item.status == 1 ? "Active" : "Inactive"}
              </h2>
            </TableCell> */}

              <TableCell>
                <div className="flex justify-center">
                  <DateBox created_at={item.created_at} updated_at={item.updated_at} />
                </div>
              </TableCell>

              {/* <TableCell>
              <EditDeleteButton
                id={item._id}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
              />
              <FiEye
                size={18}
                className="cursor-pointer text-blue-600 hover:text-blue-800"
                onClick={() => handlePasswordDrawer(item._id)}
              />
            </TableCell> */}
              <TableCell className="text-center">
                <div className="flex justify-center space-x-3">
                  {/* Password Eye Icon */}
                  <div
                    onClick={() => handlePasswordDrawer(item._id)}
                    className="p-2 cursor-pointer text-gray-400 hover:text-blue-600"
                  >
                    <Tooltip
                      id="password"
                      Icon={FiLock}
                      title="Update Password"
                      bgColor="#2563EB"
                    />
                  </div>
                  {/* Edit/Delete Buttons */}
                  <EditDeleteButton
                    id={item._id}
                    handleUpdate={handleUpdate}
                    handleModalOpen={handleModalOpen}
                  />
                </div>
              </TableCell>


            </TableRow>
          ))}

      </TableBody>
    </>
  );
};


export default React.memo(BrandTable);
