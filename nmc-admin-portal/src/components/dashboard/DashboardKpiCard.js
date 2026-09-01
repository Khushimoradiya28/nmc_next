import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';

const DashboardKpiCard = ({
  title,
  count = 0,
  icon: Icon,
  badgeText,
  gradient = 'from-red-800 to-red-600',
  iconBg = 'bg-red-50 text-red-800 dark:bg-red-950/60 dark:text-red-300',
  linkTo,
  subtext,
}) => {
  return (
    <div className="relative group overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-200/90 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between">
      {/* Top gradient accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${gradient}`} />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-sm ${iconBg}`}
          >
            {Icon && <Icon className="w-6 h-6" />}
          </div>
          <div className="min-w-0">
            <p
              className="text-xs md:text-sm font-bold text-gray-800 dark:text-gray-100 tracking-tight leading-tight truncate"
              title={title}
            >
              {title}
            </p>
            <h3 className="text-2xl md:text-3xl font-black text-gray-950 dark:text-white mt-1 tracking-tight">
              {count}
            </h3>
          </div>
        </div>

        {linkTo && (
          <Link
            to={linkTo}
            className="p-1.5 rounded-lg text-gray-500 hover:text-red-800 dark:hover:text-amber-400 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
            title="View Details"
          >
            <FiArrowUpRight className="w-5 h-5 font-bold" />
          </Link>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/80 flex items-center justify-between gap-2 text-xs">
        <span className="text-gray-600 dark:text-gray-300 font-semibold truncate">
          {subtext || 'Live records'}
        </span>
        {badgeText && (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700 flex-shrink-0">
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
};

export default DashboardKpiCard;
