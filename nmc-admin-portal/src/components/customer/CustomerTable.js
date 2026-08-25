import React from "react";
import { useHistory } from "react-router-dom";
import { TableCell, TableBody, TableRow } from "@windmill/react-ui";
import MainModal from "../modal/MainModal";
import useToggleDrawer from "../../hooks/useToggleDrawer";
import DateBox from "../form/DateBox";

const DataTable = ({ customers }) => {
  const { serviceId } = useToggleDrawer();
  const history = useHistory(); // for navigation

  const handleClickOrders = (userId) => {
    history.push(`/orders/${userId}`); // use userId, not item._id
  };

  return (
    <>
      <MainModal id={serviceId} />
      <TableBody>
        {customers?.map((item, i) => {
          return (
            <TableRow key={item._id || i}>
              <TableCell>{i + 1}</TableCell>

              <TableCell>
                {item.first_name || item.last_name
                  ? `${item.first_name || ""} ${item.last_name || ""}`.trim()
                  : "N/A"}
              </TableCell>

              <TableCell>{item.email || "N/A"}</TableCell>
              <TableCell>{item.mobile || "N/A"}</TableCell>

              {/* Clickable total_orders */}
              <TableCell>
                <span
                  onClick={() => handleClickOrders(item._id)} // pass item._id
                  className="text-blue-600 cursor-pointer hover:underline"
                >
                  {item.total_orders || 0}
                </span>
              </TableCell>

              <TableCell>
                <DateBox
                  created_at={item.created_at}
                  updated_at={item.updated_at}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </>
  );
};

export default React.memo(DataTable);
