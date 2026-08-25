import React, { useEffect } from "react";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { Link } from "react-router-dom";
import { TableCell, TableBody, TableRow, Badge } from "@windmill/react-ui";

import MainModal from "../../modal/MainModal";
import MainDrawer from "../../drawer/MainDrawer";
import BrandDrawer from "../drawer/BrandDrawer";
import EditDeleteButton from "../../table/EditDeleteButton";
import useToggleDrawer from "../../../hooks/useToggleDrawer";
import DateBox from "../../form/DateBox";
import ShowHideButton from "../../table/ShowHideButton";

const getStatusBadge = (status) => {
  switch (Number(status)) {
    case 0:
      return { name: "Deactive", color: "danger" };
    case 1:
      return { name: "Active", color: "success" };
  }
};

const BrandTable = ({ brand, currentPage = 1, resultsPerPage = 10 }) => {
  const { serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();

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
      <MainDrawer>
        <BrandDrawer id={serviceId} />
      </MainDrawer>

      <TableBody>
        {brand
          ?.filter((item) => item.status === 1 || item.status === 0)
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
                    <a data-fancybox href={item.brand_logo}>
                      <img
                        src={item.brand_logo}
                        alt={item.brand_name}
                        className="object-cover w-full h-full"
                      />
                    </a>
                    <div className="absolute inset-0 shadow-inner pointer-events-none"></div>
                  </div>
                </div>
              </TableCell>

              <TableCell className="text-center">
                <h2 className="text-sm font-medium">{item.brand_name}</h2>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <ShowHideButton id={item._id} status={item.status}type="brand" />
                </div>
              </TableCell>

              <TableCell className="text-center">
                <div className="flex justify-center">
                  <DateBox
                    created_at={item.created_at}
                    updated_at={item.updated_at}
                  />
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

export default React.memo(BrandTable);
