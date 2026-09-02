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

// numeric -> ordinal (1 -> 1ST)
const toOrdinal = (n) => {
  const num = parseInt(n);
  if (isNaN(num)) return n;
  const s = ['TH', 'ST', 'ND', 'RD'];
  const v = num % 100;
  return `${num}${s[(v - 20) % 10] || s[v] || s[0]}`;
};

const RankerTable = ({
  rankers = [],
  currentPage = 1,
  resultsPerPage = 10,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const list = Array.isArray(rankers) ? rankers : [];
  const startIndex = (currentPage - 1) * resultsPerPage;

  return (
    <>
      <TableHeader>
        <tr>
          <TableCell>Sr. No.</TableCell>
          <TableCell>Student</TableCell>
          <TableCell>Rank</TableCell>
          <TableCell>Programme</TableCell>
          <TableCell>Semester / Year</TableCell>
          <TableCell>Academic Year</TableCell>
          <TableCell>Time Stamp</TableCell>
          <TableCell className="text-center">Status</TableCell>
          <TableCell className="text-right">Actions</TableCell>
        </tr>
      </TableHeader>

      <TableBody>
        {list.map((item, i) => {
          const actionId = item._id || item.slug || item.id || item.guid;
          const name = item.name || 'Student';
          const avatarUrl =
            resolveMedalistImage(item) ||
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80';
          const rankNum = item.rankNum;
          const rankLabel = item.rankLabel || 'University Rank Holder';
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
              <TableCell>
                <span className="text-xs font-semibold text-gray-500">{startIndex + i + 1}</span>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar src={avatarUrl} alt={name} size="regular" className="shrink-0 rounded-xl" />
                  <div>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100 block">{name}</span>
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 truncate max-w-xs block font-medium">
                      🏆 {rankLabel}
                    </span>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <Badge
                  type="warning"
                  className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold px-2.5 py-1 text-[11px] rounded-full uppercase"
                >
                  {toOrdinal(rankNum)}
                </Badge>
              </TableCell>

              <TableCell>
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{item.programme}</span>
              </TableCell>

              <TableCell>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">{item.semesterYear}</span>
              </TableCell>

              <TableCell>
                <span className="text-xs font-bold text-red-800 dark:text-red-400">{item.academicYear || 'N/A'}</span>
              </TableCell>

              <TableCell>
                <DateBox created_at={item.created_at || item.createdAt} updated_at={item.updated_at || item.updatedAt} />
              </TableCell>

              <TableCell className="text-center">
                <ShowHideButton id={actionId} status={statusVal} type="ranker" />
              </TableCell>

              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onViewDetails && onViewDetails(item)}
                    className="p-2 text-gray-500 hover:text-red-800 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="View Full Details"
                  >
                    <FiEye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit && onEdit(item)}
                    className="p-2 text-gray-500 hover:text-red-800 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Edit Ranker"
                  >
                    <FiEdit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete && onDelete(item)}
                    className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Delete Ranker"
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

export default React.memo(RankerTable);
