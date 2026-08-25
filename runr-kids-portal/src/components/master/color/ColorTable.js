import React from 'react';
import { Link } from 'react-router-dom';
import {
  TableCell,
  TableBody,
  TableRow,
} from '@windmill/react-ui';

import MainModal from '../../modal/MainModal';
import MainDrawer from '../../drawer/MainDrawer';
import ColorDrawe from '../drawer/ColorDrawe';
import EditDeleteButton from '../../table/EditDeleteButton';
import useToggleDrawer from '../../../hooks/useToggleDrawer';
import DateBox from '../../form/DateBox';

const DataTable = ({ brand, currentPage = 1, resultsPerPage = 10 }) => {
  const { serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();

  // Calculate the starting index for the current page
  const startIndex = (currentPage - 1) * resultsPerPage;

  return (
    <>
      <MainModal id={serviceId} />
      <MainDrawer>
        <ColorDrawe id={serviceId} />
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

              {/* Color Name Cell */}
              <TableCell className="text-center">
                <h2 className="text-sm font-medium">{item.color_name}</h2>
              </TableCell>

              {/* Color Code Cell with Color Box */}
              <TableCell className="text-center">
                <div className="flex items-center justify-center space-x-2">
                  {/* The Color Box */}
                  <div
                    style={{ backgroundColor: item.color_code }}
                    className="w-5 h-5 rounded border border-gray-300 shadow-sm"
                    title={item.color_code} // Optional: show color code on hover
                  ></div>
                  {/* The Color Code Text */}
                  <h2 className="text-sm font-medium">{item.color_code}</h2>
                </div>
              </TableCell>

              <TableCell className="text-center">
                <div className="flex justify-center">
                  <DateBox created_at={item.created_at} updated_at={item.updated_at} />
                </div>
              </TableCell>

              <TableCell className="text-center">
                <div className="flex justify-center">
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


export default React.memo(DataTable);