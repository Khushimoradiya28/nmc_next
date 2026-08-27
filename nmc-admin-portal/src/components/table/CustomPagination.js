import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const CustomPagination = ({
  totalResults = 0,
  resultsPerPage = 10,
  currentPage = 1,
  onChange,
  label = 'Navigation',
}) => {
  const totalPages = Math.ceil(totalResults / resultsPerPage) || 1;
  const start = totalResults === 0 ? 0 : (currentPage - 1) * resultsPerPage + 1;
  const end = Math.min(currentPage * resultsPerPage, totalResults);

  // Generate page numbers
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      if (onChange) onChange(page);
    }
  };

  return (
    <div
      className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600 dark:text-gray-400 py-3 px-4 w-full"
      aria-label={label}
    >
      {/* Dynamic Showing Text */}
      <span className="font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
        {totalResults <= 1
          ? `SHOWING ${totalResults} OF ${totalResults}`
          : start === end
          ? `SHOWING ${start} OF ${totalResults}`
          : `SHOWING ${start}-${end} OF ${totalResults}`}
      </span>

      {/* Pagination Numbers & Buttons */}
      <div className="inline-flex items-center gap-1">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`p-1.5 rounded-md border text-xs transition-colors flex items-center justify-center ${
            currentPage <= 1
              ? 'opacity-40 cursor-not-allowed border-gray-200 dark:border-gray-700 text-gray-400'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
          }`}
          aria-label="Previous Page"
        >
          <FiChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Page Buttons */}
        {pages.map((p) => {
          const isActive = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => handlePageClick(p)}
              className={`w-7 h-7 rounded-md font-semibold text-xs transition-all flex items-center justify-center ${
                isActive
                  ? 'bg-red-800 text-white shadow-xs'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {p}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          type="button"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`p-1.5 rounded-md border text-xs transition-colors flex items-center justify-center ${
            currentPage >= totalPages
              ? 'opacity-40 cursor-not-allowed border-gray-200 dark:border-gray-700 text-gray-400'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
          }`}
          aria-label="Next Page"
        >
          <FiChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default CustomPagination;
