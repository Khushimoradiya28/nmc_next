import React from 'react';
import { Link } from 'react-router-dom';
import {
  TableCell,
  TableBody,
  TableRow,
} from '@windmill/react-ui';

import MainModal from '../../modal/MainModal';
import MainDrawer from '../../drawer/MainDrawer';
import CommodityDrawe from '../drawer/CommodityDrawe';
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
        <CommodityDrawe id={serviceId} />
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
                <h2 className="text-sm font-medium">{item.commodity_name}</h2>
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
