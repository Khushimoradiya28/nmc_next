import React from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import "flatpickr/dist/themes/material_red.css";
import { FiCalendar, FiX } from "react-icons/fi";

/**
 * Reusable Custom Date Range Picker Component
 * Accepts fromDate and toDate values with callbacks onFromDateChange and onToDateChange
 */
const CustomDateRangePicker = ({
  fromDate = "",
  toDate = "",
  onFromDateChange,
  onToDateChange,
  className = "",
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      {/* Inline From Date Filter */}
      <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md border border-gray-200 dark:border-gray-600 h-10 transition-colors">
        <FiCalendar size={15} className="text-gray-500 dark:text-gray-400 shrink-0" />
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 shrink-0">From:</span>
        <Flatpickr
          value={fromDate ? new Date(fromDate) : ""}
          onChange={([date]) => {
            if (!date) {
              if (onFromDateChange) onFromDateChange("");
              return;
            }
            // Format to YYYY-MM-DD using local timezone offset
            const offset = date.getTimezoneOffset();
            const localDate = new Date(date.getTime() - (offset * 60 * 1000));
            const formatted = localDate.toISOString().split("T")[0];
            if (onFromDateChange) onFromDateChange(formatted);
          }}
          options={{
            dateFormat: "Y-m-d",
            altInput: true,
            altFormat: "d/m/Y",
            altInputClass: "bg-transparent text-xs text-gray-800 dark:text-gray-200 border-none outline-none focus:outline-none focus:ring-0 shadow-none p-0 w-[95px] cursor-pointer font-medium",
            allowInput: false,
            disableMobile: true,
            monthSelectorType: "static",
          }}
          placeholder="dd/mm/yyyy"
          className="bg-transparent text-xs text-gray-800 dark:text-gray-200 focus:outline-none w-24 cursor-pointer font-medium"
        />
        {fromDate && (
          <button
            type="button"
            onClick={() => onFromDateChange && onFromDateChange("")}
            className="ml-1 text-gray-400 hover:text-red-500 transition-colors focus:outline-none"
            title="Clear From Date"
          >
            <FiX size={13} />
          </button>
        )}
      </div>

      {/* Inline To Date Filter */}
      <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md border border-gray-200 dark:border-gray-600 h-10 transition-colors">
        <FiCalendar size={15} className="text-gray-500 dark:text-gray-400 shrink-0" />
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 shrink-0">To:</span>
        <Flatpickr
          value={toDate ? new Date(toDate) : ""}
          onChange={([date]) => {
            if (!date) {
              if (onToDateChange) onToDateChange("");
              return;
            }
            // Format to YYYY-MM-DD using local timezone offset
            const offset = date.getTimezoneOffset();
            const localDate = new Date(date.getTime() - (offset * 60 * 1000));
            const formatted = localDate.toISOString().split("T")[0];
            if (onToDateChange) onToDateChange(formatted);
          }}
          options={{
            dateFormat: "Y-m-d",
            altInput: true,
            altFormat: "d/m/Y",
            altInputClass: "bg-transparent text-xs text-gray-800 dark:text-gray-200 border-none outline-none focus:outline-none focus:ring-0 shadow-none p-0 w-[95px] cursor-pointer font-medium",
            allowInput: false,
            disableMobile: true,
            monthSelectorType: "static",
          }}
          placeholder="dd/mm/yyyy"
          className="bg-transparent text-xs text-gray-800 dark:text-gray-200 focus:outline-none w-24 cursor-pointer font-medium"
        />
        {toDate && (
          <button
            type="button"
            onClick={() => onToDateChange && onToDateChange("")}
            className="ml-1 text-gray-400 hover:text-red-500 transition-colors focus:outline-none"
            title="Clear To Date"
          >
            <FiX size={13} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomDateRangePicker;
