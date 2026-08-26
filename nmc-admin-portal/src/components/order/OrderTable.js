import React from "react";
import { Link, useHistory } from "react-router-dom";
import {
  TableCell,
  TableBody,
  TableRow,
  Badge,
  Avatar,
  Button, // Using Button for a better action look
} from "@windmill/react-ui";
import { FiDownload, FiEdit } from "react-icons/fi";
import MainModal from "../modal/MainModal";
import useToggleDrawer from "../../hooks/useToggleDrawer";
import DateBox from "../form/DateBox";
import Tooltip from '../tooltip/Tooltip';
import MainDrawer from '../drawer/MainDrawer';
import OrderStatusDrawer from '../drawer/OrderStatusDrawer';
import EditDeleteButton from "../table/EditDeleteButton";
import ViewButton from "../table/ViewButton";

// --- HELPER FUNCTIONS ---

// 1. Map the integer status to a descriptive name and color
const getOrderStatus = (statusInt) => {

  const status = Number(statusInt);

  switch (status) {
    case 0: return { name: "Pending", color: "danger" };
    case 1: return { name: "Completed", color: "success" };
    case 2: return { name: "Confirmed", color: "success" };
    case 3: return { name: "Cancelled", color: "warning" };
    case 4: return { name: "Shipped", color: "primary" };
    case 5: return { name: "Delivered", color: "primary" };
    default: return { name: "Unknown", color: "neutral" };
  }
};


const statusColors = {
  success: "bg-green-200 text-green-700 dark:bg-green-700 dark:text-green-200",
  warning: "bg-yellow-200 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-200",
  primary: "bg-blue-200 text-blue-700 dark:bg-blue-700 dark:text-blue-200",
  danger: "bg-red-200 text-red-700 dark:bg-red-700 dark:text-red-200",
  neutral: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
  info: "bg-orange-200 text-orange-700 dark:bg-orange-700 dark:text-orange-200",
};

const DataTable = ({ products, currentPage = 1, resultsPerPage = 10, }) => {
  const { serviceId, drawerView, handleOrderDrawer } = useToggleDrawer();
  const history = useHistory();

  const startIndex = (currentPage - 1) * resultsPerPage;

  // Function to handle viewing order details
  const handleViewDetails = (id) => {
    history.push(`/order-details/${id}`);
  };

  return (
    <>
      <MainModal id={serviceId} />
      <MainDrawer>
        {/* {drawerView === "ORDER" && <OrderStatusDrawer id={serviceId} />} */}
        {drawerView === "ORDER" && <OrderStatusDrawer orderId={serviceId} />}
      </MainDrawer>

      <TableBody>
        {products
          // Assuming you want to display all orders from the response, no filter applied here.
          .map((item, i) => {
            // console.log(item);

            const statusInfo = getOrderStatus(item.order_status);

            return (
              <TableRow key={item._id || i}>
                {/* 1. Index and Order ID */}
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs uppercase font-semibold text-gray-500">
                      {startIndex + i + 1}
                    </span>
                    <span className="font-medium text-sm text-gray-800"></span>
                  </div>
                </TableCell>

                {/* 2. User Name */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-200 text-pink-700 font-semibold">
                      {item.user_name
                        ? item.user_name.charAt(0).toUpperCase()
                        : "U"}
                    </div>

                    <span className="text-sm font-medium">
                      {item.user_name || "N/A"}
                    </span>
                  </div>
                </TableCell>

                {/* 3. Order Status - BADGE DESIGN */}

                <TableCell>
                  <span className="text-sm font-semibold">
                    ₹{(item.order_subtotal || 0).toFixed(2)}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="text-sm font-semibold">
                    ₹{(item.order_discount || 0).toFixed(2)}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="text-sm font-semibold">
                    ₹{(item.order_shipping_charge || 0).toFixed(2)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-semibold">
                    ₹{(item.order_total || 0).toFixed(2)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge type={statusInfo.color}>{statusInfo.name}</Badge>
                </TableCell>
                <TableCell>
                  {/* <span className="text-sm font-semibold">
                    {item.payment_method || "N/A"}
                  </span> */}
                  <span className="text-sm font-semibold">
                    {item?.payment_method ?? "N/A"}
                  </span>
                </TableCell>

                {/* 5. Date/Time */}
                <TableCell>
                  <DateBox
                    created_at={item.created_at}
                    updated_at={item.updated_at}
                  />
                </TableCell>

                {/* 6. Action Button - VIEW DETAILS */}

                <TableCell>
                  <div className="flex gap-3">
                    <div
                      onClick={() => handleOrderDrawer(item._id, "ORDER")}
                      className="p-2 cursor-pointer"
                    >
                      <Tooltip
                        id="edit"
                        Icon={FiEdit}
                        title="Update Order Status"
                      />
                    </div>

                    <ViewButton
                      id={item._id}
                      onView={(id) =>
                        history.push(`/order-details/${id}`)
                      }
                    />

                    {item.invoice_path && (
                      <button
                        onClick={() =>
                          window.open(item.invoice_path, "_blank")
                        }
                        className="p-2 bg-blue-600 text-white rounded"
                      >
                        <FiDownload />
                      </button>
                    )}
                  </div>
                </TableCell>

              </TableRow>
            );
          })}
      </TableBody>
    </>
  );
};

export default React.memo(DataTable);
