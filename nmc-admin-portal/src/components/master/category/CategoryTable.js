import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { TableCell, TableBody, TableRow } from "@windmill/react-ui";

import MainModal from "../../modal/MainModal";
import MainDrawer from "../../drawer/MainDrawer";
import CategoryDrawer from "../drawer/CategoryDrawer";
import EditDeleteButton from "../../table/EditDeleteButton";
import useToggleDrawer from "../../../hooks/useToggleDrawer";
import DateBox from "../../form/DateBox";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import ShowHideButton from "../../table/ShowHideButton";

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
        <CategoryDrawer id={serviceId} />
      </MainDrawer>

      <TableBody>
        {brand
          ?.filter((item) => item.status == 1 || item.status == 0)
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
                    <a data-fancybox href={item.category_image}>
                      <img
                        src={item.category_image}
                        alt={item.category_name}
                        className="object-cover w-full h-full"
                      />
                    </a>
                    <div className="absolute inset-0 shadow-inner pointer-events-none"></div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <h2 className="text-sm font-medium">{item.category_name}</h2>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <ShowHideButton id={item._id} status={item.status} type="category" />
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
