import React from 'react';
import { Link } from 'react-router-dom';
import {
  TableCell,
  TableBody,
  TableRow,
  Badge,
  Avatar,
} from '@windmill/react-ui';
import { FiMail, FiPhone } from 'react-icons/fi';

import Tooltip from '../tooltip/Tooltip';
import MainModal from '../modal/MainModal';
import MainDrawer from '../drawer/MainDrawer';
import ProductDrawer from '../drawer/ProductDrawer';
import ShowHideButton from '../table/ShowHideButton';
import EditDeleteButton from '../table/EditDeleteButton';
import useToggleDrawer from '../../hooks/useToggleDrawer';
import DateBox from '../form/DateBox';
import { FiEye } from 'react-icons/fi';

const LeadTable = ({ products, currentPage = 1, resultsPerPage = 10 }) => {

  const { serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();
  // Calculate the starting index for the current page
  const startIndex = (currentPage - 1) * resultsPerPage;

  return (
    <>
      <MainModal id={serviceId} />

      <MainDrawer>
        <ProductDrawer id={serviceId} />
      </MainDrawer>

      <TableBody>
        {products
          ?.filter((product) => product.status == 1)
          .map((product, i) => (
            <TableRow key={product._id || i}>

              {/* Index */}
              <TableCell>
                <span className="text-xs uppercase font-semibold">
                  {startIndex + i + 1}
                </span>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-3">
                  {/* <div className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-200 text-pink-700 font-semibold">
                {product.first_name && product.last_name
                  ? (product.first_name.charAt(0)).toUpperCase()
                  : "U"}
              </div> */}

                  <span className="text-sm font-medium">
                    {product.first_name || product.last_name
                      ? `${product.first_name || ""} ${product.last_name || ""}`.trim()
                      : "N/A"}
                  </span>
                </div>
              </TableCell>

              <TableCell>
                {/* <div className="flex flex-col text-sm gap-1"> */}

                {/* Email */}
                <div className="flex items-center gap-2">
                  <FiMail className="text-gray-500" size={14} />
                  <span>{product.email || "N/A"}</span>
                </div>
              </TableCell>
              <TableCell>

                {/* Mobile */}
                <div className="flex items-center gap-2">
                  <FiPhone className="text-gray-500" size={14} />
                  <span>{product.mobile || "N/A"}</span>
                </div>

                {/* </div> */}
              </TableCell>

              <TableCell>
                <span className="flex flex-col text-sm">{product.lead_type || "-"}</span>
              </TableCell>

              <TableCell>
                <div style={{ position: "relative", width: "320px" }}>
                  <span
                    style={{
                      display: "block",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.nextSibling.style.display = "block";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.nextSibling.style.display = "none";
                    }}
                  >
                    {product.message}
                  </span>

                  <div
                    style={{
                      display: "none",
                      position: "absolute",
                      left: "0",
                      top: "110%",
                      zIndex: 9999,

                      backgroundColor: "#1a1c23",
                      color: "#fff",

                      padding: "12px 16px",
                      borderRadius: "8px",

                      fontSize: "13px",
                      lineHeight: "1.7",

                      maxWidth: "900px",        // 🔥 allow much wider tooltip
                      minWidth: "400px",        // 🔥 readable base width
                      width: "max-content",     // 🔥 grow with content
                      whiteSpace: "normal",     // allow wrapping
                      wordBreak: "break-word",

                      boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
                    }}
                  >
                    {product.message}
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <span className="flex flex-col text-sm">{product.utm_source || "-"}</span>
              </TableCell>

              <TableCell>
                <span className="flex flex-col text-sm">{product.utm_medium || "-"}</span>
              </TableCell>

              <TableCell>
                <span className="flex flex-col text-sm">{product.utm_campaign || "-"}</span>
              </TableCell>

              <TableCell>
                <span className="flex flex-col text-sm">{product.utm_content || "-"}</span>
              </TableCell>

              <TableCell>
                <span className="flex flex-col text-sm">{product.utm_term || "-"}</span>
              </TableCell>

               <TableCell>
                <span className="flex flex-col text-sm">{product.i_referrer || "-"}</span>
              </TableCell>

              <TableCell>
                <span className="flex flex-col text-sm">{product.l_referrer || "-"}</span>
              </TableCell>

              <TableCell>
                <span className="flex flex-col text-sm">{product.landing_page || "-"}</span>
              </TableCell>

              <TableCell>
                <span className="flex flex-col text-sm">{product.visits || "-"}</span>
              </TableCell>

              <TableCell>
                <DateBox created_at={product.created_at} />
              </TableCell>

              {/* Edit/Delete Button */}
              {/* <TableCell>
            <EditDeleteButton
              id={product._id}
              handleUpdate={handleUpdate}
              handleModalOpen={handleModalOpen}
            />
          </TableCell> */}

            </TableRow>
          ))}
      </TableBody>
    </>

  );
};

export default React.memo(LeadTable);
