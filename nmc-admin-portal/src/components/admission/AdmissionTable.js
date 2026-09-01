import React from 'react';
import {
  TableCell,
  TableBody,
  TableRow,
} from '@windmill/react-ui';
import { FiTrash2 } from 'react-icons/fi';

import DateBox from '../form/DateBox';

const AdmissionTable = ({
  admissions,
  currentPage = 1,
  resultsPerPage = 8,
  totalResults = 0,
  sortOrder = 'desc',
  onDelete,
}) => {
  return (
    <TableBody className="divide-y divide-gray-100 dark:divide-gray-700/60">
      {admissions?.map((item, i) => {
        const fullName = item.full_name || item.fullName || "N/A";
        const mobile = item.mobile || "-";
        const email = item.email || "-";
        const dob = item.dob || "-";
        const gender = item.gender || "-";
        const cityVillage = item.city_village || item.cityVillage || "-";
        const course = item.course || "-";
        const qualification = item.last_qualification || item.qualification || "-";

        // Dynamic sequence number respecting ASC / DESC sort order
        const serialNo =
          sortOrder === "asc"
            ? (currentPage - 1) * resultsPerPage + i + 1
            : Math.max(1, (totalResults || admissions.length) - ((currentPage - 1) * resultsPerPage + i));

        return (
          <TableRow
            key={item._id || item.id || i}
            className="hover:bg-gray-50/80 dark:hover:bg-gray-800/60 transition-colors duration-150"
          >
            {/* 1. Sr. No. */}
            <TableCell className="py-3 px-4">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                {serialNo}
              </span>
            </TableCell>

            {/* 2. Full Name */}
            <TableCell className="py-3 px-4">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {fullName}
              </span>
            </TableCell>

            {/* 3. Mobile Number */}
            <TableCell className="py-3 px-4">
              <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                {mobile}
              </span>
            </TableCell>

            {/* 4. Email Address */}
            <TableCell className="py-3 px-4">
              {email && email !== "-" ? (
                <a
                  href={`mailto:${email}`}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium max-w-[180px] truncate block"
                >
                  {email}
                </a>
              ) : (
                <span className="text-xs text-gray-400">-</span>
              )}
            </TableCell>

            {/* 5. Date of Birth */}
            <TableCell className="py-3 px-4">
              <span className="text-xs text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">
                {dob}
              </span>
            </TableCell>

            {/* 6. Gender */}
            <TableCell className="py-3 px-4">
              <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                {gender}
              </span>
            </TableCell>

            {/* 7. City / Village */}
            <TableCell className="py-3 px-4">
              <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                {cityVillage}
              </span>
            </TableCell>

            {/* 8. Course Interested In (Red Badge matching Leads) */}
            <TableCell className="py-3 px-4">
              <span className="inline-block bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-medium px-2.5 py-1 rounded-md border border-red-100 dark:border-red-800/50 shadow-2xs">
                {course}
              </span>
            </TableCell>

            {/* 9. Last Qualification */}
            <TableCell className="py-3 px-4">
              <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                {qualification}
              </span>
            </TableCell>

            {/* 10. Time Stamp */}
            <TableCell className="py-3 px-4 overflow-visible relative">
              <DateBox
                created_at={item.created_at || item.createdAt}
                showUpdated={false}
              />
            </TableCell>

            {/* 11. Actions (Delete Icon) */}
            <TableCell className="py-3 px-4 text-right">
              <button
                type="button"
                onClick={() => onDelete && onDelete(item._id || item.id || item.guid)}
                className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none cursor-pointer"
                title="Delete Admission Lead"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
};

export default React.memo(AdmissionTable);
