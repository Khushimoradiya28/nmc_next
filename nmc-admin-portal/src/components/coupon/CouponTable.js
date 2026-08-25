import React from 'react';
import { Link } from 'react-router-dom';
import { TableCell, TableBody, TableRow, Badge } from '@windmill/react-ui';

import MainModal from '../modal/MainModal';
import MainDrawer from '../drawer/MainDrawer';
import CouponDrawer from '../drawer/CouponDrawer';
import useToggleDrawer from '../../hooks/useToggleDrawer';
import EditDeleteButton from '../table/EditDeleteButton';

const BrandTable = ({ brand }) => {
  const { serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();

  return (
    <>
      <MainModal id={serviceId} />
      <MainDrawer>
        <CouponDrawer id={serviceId} />
      </MainDrawer>

      <TableBody>
        {brand?.filter((item) => item.status === 1)
          .map((item, i) => (
            <TableRow key={i}>
              <TableCell>
                <span className="text-xs uppercase font-semibold">
                  {i + 1}
                </span>
              </TableCell>

              {/* <TableCell>
              <div className="flex items-center">
                <div className="relative inline-block w-12 h-12">
                  <img
                    src={item.brand_logo}
                    alt={item.brand_name}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 shadow-inner"></div>
                </div>
              </div>
            </TableCell> */}


              <TableCell>
                <h2 className="text-sm font-medium">{item.coupon_code || "-"}</h2>
              </TableCell>
              <TableCell>
                <h2 className="text-sm font-medium">{item.discount_type || "-"}</h2>
              </TableCell>
              <TableCell>
                <h2 className="text-sm font-medium">{item.coupon_amount || "-"}</h2>
              </TableCell>
              <TableCell>
                <h2 className="text-sm font-medium">{item.start_date || "-"}</h2>
              </TableCell>
              <TableCell>
                <h2 className="text-sm font-medium">{item.end_date || "-"}</h2>
              </TableCell>

              <TableCell>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="font-medium text-center">Created:</div>
                  <div className="font-medium text-center">Updated:</div>

                  <div className="text-center">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleString()
                      : "-"}
                  </div>
                  <div className="text-center">
                    {item.updated_at
                      ? new Date(item.updated_at).toLocaleString()
                      : "-"}
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <EditDeleteButton
                  id={item._id}
                  handleUpdate={handleUpdate}
                  handleModalOpen={handleModalOpen}
                />
              </TableCell>
            </TableRow>
          ))}

      </TableBody>
    </>
  );
};


export default React.memo(BrandTable);
