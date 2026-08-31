import React from "react";
import { TableBody, TableRow, TableCell } from "@windmill/react-ui";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import DateBox from "../form/DateBox";

const BannerTable = ({
  banners = [],
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <TableBody>
      {banners.map((item, index) => (
        <TableRow
          key={item.id}
          className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          {/* 1. SR. NO. */}
          <TableCell>
            <span className="text-xs uppercase font-semibold text-gray-600 dark:text-gray-400">
              {index + 1}
            </span>
          </TableCell>

          {/* 2. BANNER IMAGE PREVIEW */}
          <TableCell>
            <div className="w-28 h-14 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shrink-0 shadow-xs my-1">
              <img
                src={item.image}
                alt={item.title || `Banner Slide ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80";
                }}
              />
            </div>
          </TableCell>

          {/* 3. TITLE (Admin Internal Reference Title) */}
          <TableCell>
            <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 block max-w-xs truncate">
              {item.title || "Untitled Banner"}
            </span>
          </TableCell>

          {/* 4. ACTIVE STATUS TOGGLE */}
          <TableCell className="text-center">
            <span
              className="cursor-pointer text-2xl inline-flex items-center justify-center"
              onClick={() => onToggleStatus && onToggleStatus(item.id)}
              title={item.status ? "Deactivate Banner Image" : "Activate Banner Image"}
            >
              {item.status ? (
                <BsToggleOn className="text-red-800" />
              ) : (
                <BsToggleOff className="text-orange-500" />
              )}
            </span>
          </TableCell>

          {/* 5. TIME STAMP */}
          <TableCell>
            <DateBox
              updatedAt={item.updated_at || item.updatedAt || item.created_at}
              createdAt={item.created_at || item.createdAt}
            />
          </TableCell>

          {/* 6. ACTIONS (FacultyTable style soft red hover box, zero tooltip bubble) */}
          <TableCell className="text-right">
            <div className="flex items-center justify-end gap-1">
              <button
                type="button"
                onClick={() => onEdit && onEdit(item)}
                className="p-2 text-gray-500 hover:text-red-800 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none"
                title="Edit Banner Image"
              >
                <FiEdit className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete && onDelete(item.id)}
                className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none"
                title="Delete Banner Image"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default BannerTable;
