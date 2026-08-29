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

const FacultyTable = ({
  faculties = [],
  currentPage = 1,
  resultsPerPage = 10,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const displayFaculties = Array.isArray(faculties) ? faculties : [];
  const startIndex = (currentPage - 1) * resultsPerPage;

  return (
    <>
      <TableHeader>
        <tr>
          <TableCell>Sr. No.</TableCell>
          <TableCell>Faculty Member</TableCell>
          <TableCell>Badge / Category</TableCell>
          <TableCell>Designation & Qualification</TableCell>
          <TableCell>Experience & Stream</TableCell>
          <TableCell>Time Stamp</TableCell>
          <TableCell className="text-center">Status</TableCell>
          <TableCell className="text-right">Actions</TableCell>
        </tr>
      </TableHeader>

      <TableBody>
        {displayFaculties.map((item, i) => {
          const actionId = item._id || item.slug || item.id || item.guid;
          const fullName = item.fullName || item.name || 'Faculty Member';
          const avatarUrl =
            item.photo_webp_url ||
            item.photo_url ||
            item.image ||
            item.photo ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
          const badge = item.badgeTag || item.badge || 'FACULTY';
          const designation = item.designation || '';
          const qualification = item.qualifications || item.qualification || '';
          const experience = item.experience || 'N/A';
          const department = item.department || item.stream || 'B.B.A.';
          const highlight = item.keyHighlight || item.highlight || '';
          const statusVal =
            item.status === 'active' ||
            item.status === 1 ||
            item.status === true ||
            item.status === '1' ||
            item.is_active === 1 ||
            item.is_active === true
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

              {/* Faculty Member (Avatar + Name) */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar
                    src={avatarUrl}
                    alt={fullName}
                    size="regular"
                    className="shrink-0 rounded-xl"
                  />
                  <div>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100 block">
                      {fullName}
                    </span>
                    {highlight && (
                      <span className="text-[11px] text-amber-600 dark:text-amber-400 truncate max-w-xs block font-medium">
                        ✓ {highlight}
                      </span>
                    )}
                  </div>
                </div>
              </TableCell>

              {/* Badge Tag */}
              <TableCell>
                <Badge
                  type="danger"
                  className="bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 font-bold px-2.5 py-1 text-[11px] rounded-full uppercase"
                >
                  {badge}
                </Badge>
              </TableCell>

              {/* Designation & Qualification */}
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                    {designation}
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    {qualification}
                  </span>
                </div>
              </TableCell>

              {/* Experience & Stream */}
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                    {experience}
                  </span>
                  <span className="text-[11px] font-bold text-red-800 dark:text-red-400">
                    Stream: {department}
                  </span>
                </div>
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
                  type="faculty"
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
                    title="View Full Profile Details"
                  >
                    <FiEye className="w-4 h-4" />
                  </button>

                  {/* Edit button */}
                  <button
                    type="button"
                    onClick={() => onEdit && onEdit(item)}
                    className="p-2 text-gray-500 hover:text-red-800 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Edit Faculty Member"
                  >
                    <FiEdit className="w-4 h-4" />
                  </button>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => onDelete && onDelete(item)}
                    className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Delete Faculty Member"
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

export default React.memo(FacultyTable);
