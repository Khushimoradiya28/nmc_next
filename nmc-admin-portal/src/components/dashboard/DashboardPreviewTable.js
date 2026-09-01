import React from 'react';
import { Link } from 'react-router-dom';
import { FiExternalLink } from 'react-icons/fi';
import dayjs from 'dayjs';

const DashboardPreviewTable = ({
  title,
  subtitle,
  viewAllLink,
  headers = [],
  rows = [],
  emptyMessage = 'No recent records found.',
  renderRow,
}) => {
  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="inline-flex items-center gap-1 text-xs font-bold text-red-800 hover:text-red-900 dark:text-amber-400 dark:hover:text-amber-300 hover:underline"
          >
            View All <FiExternalLink className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      <div className="overflow-x-auto">
        {rows.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-400 dark:text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700/80 text-gray-400 dark:text-gray-400 uppercase tracking-wider font-semibold">
                {headers.map((h, i) => (
                  <th key={i} className="pb-2.5 px-2">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {rows.map((item, index) => renderRow(item, index))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DashboardPreviewTable;
