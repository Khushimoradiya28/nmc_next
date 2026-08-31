import React from 'react';
import {
  TableCell,
  TableBody,
  TableRow,
} from '@windmill/react-ui';
import { FiGlobe, FiTrash2 } from 'react-icons/fi';

import DateBox from '../form/DateBox';
import ExpandableText from '../common/ExpandableText';

const LeadTable = ({ products, currentPage = 1, resultsPerPage = 10, onDelete }) => {
  const startIndex = (currentPage - 1) * resultsPerPage;

  return (
    <TableBody className="divide-y divide-gray-100 dark:divide-gray-700/60">
      {products?.map((product, i) => {
        const firstName = product.first_name || "";
        const lastName = product.last_name || "";
        const fullName = `${firstName} ${lastName}`.trim() || "N/A";

        const website = product.website || product.enter_your_website || "";
        const reason = product.reason || product.reason_contacting_us || "-";
        const course = product.course || product.choose_course || "-";
        const teacherDept = product.teacher_department || product.choose_teacher_department || "-";
        const message = product.message || product.your_message || "-";

        return (
          <TableRow 
            key={product._id || product.id || i}
            className="hover:bg-gray-50/80 dark:hover:bg-gray-800/60 transition-colors duration-150"
          >
            {/* Sr. No. */}
            <TableCell className="py-3 px-4">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                {startIndex + i + 1}
              </span>
            </TableCell>

            {/* Name */}
            <TableCell className="py-3 px-4">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {fullName}
              </span>
            </TableCell>

            {/* Website */}
            <TableCell className="py-3 px-4">
              {website ? (
                <a
                  href={website.startsWith("http") ? website : `https://${website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium max-w-[150px] truncate"
                >
                  <FiGlobe size={13} className="shrink-0 text-blue-500" />
                  <span className="truncate">{website}</span>
                </a>
              ) : (
                <span className="text-xs text-gray-400">-</span>
              )}
            </TableCell>

            {/* Reason contacting us */}
            <TableCell className="py-3 px-4">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {reason}
              </span>
            </TableCell>

            {/* Choose Course */}
            <TableCell className="py-3 px-4">
              <span className="inline-block bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-medium px-2.5 py-1 rounded-md border border-red-100 dark:border-red-800/50 shadow-2xs">
                {course}
              </span>
            </TableCell>

            {/* Teacher / Department */}
            <TableCell className="py-3 px-4">
              <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                {teacherDept}
              </span>
            </TableCell>

            {/* Your Message */}
            <TableCell className="py-3 px-4">
              <div className="max-w-[210px]">
                <ExpandableText text={message} maxLength={45} />
              </div>
            </TableCell>

            {/* Time Stamp */}
            <TableCell className="py-3 px-4 overflow-visible relative">
              <DateBox 
                created_at={product.created_at || product.createdAt} 
                updated_at={product.updated_at || product.updatedAt}
              />
            </TableCell>

            {/* Actions (Delete Icon) */}
            <TableCell className="py-3 px-4 text-right">
              <button
                type="button"
                onClick={() => onDelete && onDelete(product._id || product.id || i)}
                className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none"
                title="Delete Lead"
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

export default React.memo(LeadTable);
