import React from 'react';
import {
  TableCell,
  TableBody,
  TableRow,
  TableHeader,
  Badge,
  Avatar,
} from '@windmill/react-ui';
import { FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import ShowHideButton from '../table/ShowHideButton';
import DateBox from '../form/DateBox';
import resolveMedalistImage from '../../utils/resolveMedalistImage';

const GoldMedalistTable = ({
  medalists = [],
  currentPage = 1,
  resultsPerPage = 10,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const displayMedalists = Array.isArray(medalists) ? medalists : [];
  const startIndex = (currentPage - 1) * resultsPerPage;

  return (
    <>
      <TableHeader>
        <tr>
          <TableCell>Sr. No.</TableCell>
          <TableCell>Achiever</TableCell>
          <TableCell>Rank</TableCell>
          <TableCell>Programme & Course</TableCell>
          <TableCell>Academic Year</TableCell>
          <TableCell>Time Stamp</TableCell>
          <TableCell className="text-center">Status</TableCell>
          <TableCell className="text-right">Actions</TableCell>
        </tr>
      </TableHeader>

      <TableBody>
        {displayMedalists.map((item, i) => {
          const actionId = item._id || item.slug || item.id || item.guid;
          const name = item.name || 'Achiever';
          const avatarUrl =
            resolveMedalistImage(item) ||
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80';
          const rank = item.rank || 'RANK';
          const rankLabel = item.rankLabel || 'UNIVERSITY RANK HOLDER';
          const programme = item.programme || '';
          const subCourse = item.subCourse || '';
          const academicYear = item.academicYear || 'N/A';
          const statusVal =
            item.status === 'active' ||
            item.status === 1 ||
            item.status === true ||
            item.status === '1' ||
            item.isActive === true
              ? 1
              : 0;

          return (
            <TableRow key={actionId || i}>
              {/* Sr No */}
              <TableCell>
                <span className="text-xs font-semibold text-gray-500">
                  {startIndex + i + 1}
                </span>
              </TableCell>

              {/* Achiever (Avatar + Name) */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar
                    src={avatarUrl}
                    alt={name}
                    size="regular"
                    className="shrink-0 rounded-xl"
                  />
                  <div>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100 block">
                      {name}
                    </span>
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 truncate max-w-xs block font-medium">
                      🏆 {rankLabel}
                    </span>
                  </div>
                </div>
              </TableCell>

              {/* Rank Badge */}
              <TableCell>
                <Badge
                  type="warning"
                  className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold px-2.5 py-1 text-[11px] rounded-full uppercase"
                >
                  {rank}
                </Badge>
              </TableCell>

              {/* Programme & Course */}
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                    {programme}
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    {subCourse}
                  </span>
                </div>
              </TableCell>

              {/* Academic Year */}
              <TableCell>
                <span className="text-xs font-bold text-red-800 dark:text-red-400">
                  {academicYear}
                </span>
              </TableCell>

              {/* Time Stamp */}
              <TableCell>
                <DateBox
                  created_at={item.created_at || item.createdAt}
                  updated_at={item.updated_at || item.updatedAt}
                />
              </TableCell>

              {/* Status Toggle Switch */}
              <TableCell className="text-center">
                <ShowHideButton
                  id={actionId}
                  status={statusVal}
                  type="goldMedalist"
                />
              </TableCell>

              {/* Actions */}
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  {/* View Details Modal button */}
                  <button
                    type="button"
                    onClick={() => onViewDetails && onViewDetails(item)}
                    className="p-2 text-gray-500 hover:text-red-800 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="View Full Details"
                  >
                    <FiEye className="w-4 h-4" />
                  </button>

                  {/* Edit button */}
                  <button
                    type="button"
                    onClick={() => onEdit && onEdit(item)}
                    className="p-2 text-gray-500 hover:text-red-800 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Edit Achiever"
                  >
                    <FiEdit className="w-4 h-4" />
                  </button>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => onDelete && onDelete(item)}
                    className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Delete Achiever"
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

export default React.memo(GoldMedalistTable);
