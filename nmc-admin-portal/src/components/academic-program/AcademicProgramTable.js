import React from 'react';
import {
  TableCell,
  TableBody,
  TableRow,
  TableHeader,
  Badge,
} from '@windmill/react-ui';
import { FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';

const AcademicProgramTable = ({
  programs = [],
  currentPage = 1,
  resultsPerPage = 10,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const displayPrograms = Array.isArray(programs) ? programs : [];
  const startIndex = (currentPage - 1) * resultsPerPage;

  const getCategoryBadgeType = (category) => {
    switch (category) {
      case 'UG':
        return 'danger';
      case 'PG':
        return 'primary';
      case 'Diploma':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'UG':
        return 'UG DEGREE';
      case 'PG':
        return 'PG DEGREE';
      case 'Diploma':
        return 'DIPLOMA & VOCATIONAL';
      default:
        return category?.toUpperCase() || 'PROGRAM';
    }
  };

  return (
    <>
      <TableHeader>
        <tr>
          <TableCell>Sr. No.</TableCell>
          <TableCell>Program</TableCell>
          <TableCell>Category</TableCell>
          <TableCell>Duration & Fee</TableCell>
          <TableCell>Highlights</TableCell>
          <TableCell className="text-right">Actions</TableCell>
        </tr>
      </TableHeader>

      <TableBody>
        {displayPrograms.map((item, i) => {
          return (
            <TableRow key={item.id || i}>
              {/* Sr No */}
              <TableCell>
                <span className="text-xs font-semibold text-gray-500">
                  {startIndex + i + 1}
                </span>
              </TableCell>

              {/* Program Name */}
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {item.shortName}
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    {item.fullName}
                  </span>
                </div>
              </TableCell>

              {/* Category Badge */}
              <TableCell>
                <Badge
                  type={getCategoryBadgeType(item.category)}
                  className="bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 font-bold px-2.5 py-1 text-[11px] rounded-full uppercase"
                >
                  {getCategoryLabel(item.category)}
                </Badge>
              </TableCell>

              {/* Duration & Fee */}
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                    {item.duration || 'N/A'}
                  </span>
                  <span className="text-[11px] font-bold text-red-800 dark:text-red-400">
                    {item.fee || 'N/A'}
                  </span>
                </div>
              </TableCell>

              {/* Highlights (first 2) */}
              <TableCell>
                <div className="flex flex-col gap-0.5 max-w-xs">
                  {(item.highlights || []).slice(0, 2).map((h, idx) => (
                    <span key={idx} className="text-[11px] text-gray-600 dark:text-gray-300 truncate">
                      ✓ {h}
                    </span>
                  ))}
                  {(item.highlights || []).length > 2 && (
                    <span className="text-[10px] text-gray-400">
                      +{item.highlights.length - 2} more
                    </span>
                  )}
                </div>
              </TableCell>

              {/* Actions */}
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onViewDetails && onViewDetails(item)}
                    className="p-2 text-gray-500 hover:text-red-800 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="View Program Details"
                  >
                    <FiEye className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onEdit && onEdit(item)}
                    className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Edit Program"
                  >
                    <FiEdit className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete && onDelete(item)}
                    className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Delete Program"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </>
  );
};

export default React.memo(AcademicProgramTable);
