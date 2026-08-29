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

const formatExperience = (exp) => {
  if (!exp) return '-';
  const str = String(exp).trim();
  if (str.toLowerCase().includes('year')) {
    return str;
  }
  return `${str} Years Exp.`;
};

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
          <TableCell>Designation & Role</TableCell>
          <TableCell>Qualifications</TableCell>
          <TableCell>Teaching Streams</TableCell>
          <TableCell>Experience</TableCell>
          <TableCell>Time Stamp</TableCell>
          <TableCell className="text-center">Status</TableCell>
          <TableCell className="text-right">Actions</TableCell>
        </tr>
      </TableHeader>

      <TableBody>
        {displayFaculties.map((item, i) => {
          const fullName = item.fullName || item.name || 'Faculty Member';
          const avatarUrl =
            item.photo_webp_url ||
            item.photo_url ||
            item.image ||
            item.photo ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
          const designation = item.designation || item.badgeTag || item.badge || 'Faculty';
          const qualification = item.qualifications || item.qualification || '-';
          const experience = formatExperience(item.experience);
          const highlight = item.keyHighlight || item.highlight || '';

          const rawStreams = item.coursesStreams || item.courses_streams || item.streams || item.courseStreams;
          let streamsList = [];
          if (Array.isArray(rawStreams)) {
            streamsList = rawStreams.map((s) => (typeof s === 'string' ? s : s?.value || s?.label || s?.shortTitle || ''));
          } else if (typeof rawStreams === 'string' && rawStreams) {
            streamsList = rawStreams.split(',').map((s) => s.trim()).filter(Boolean);
          } else if (item.department) {
            streamsList = item.department.split(',').map((s) => s.trim()).filter(Boolean);
          }

          return (
            <TableRow key={item._id || item.slug || item.id || i}>
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
                        ✨ {highlight}
                      </span>
                    )}
                  </div>
                </div>
              </TableCell>

              {/* Designation & Role */}
              <TableCell>
                <Badge
                  type="danger"
                  className="bg-red-50 text-red-800 dark:bg-red-950/60 dark:text-red-300 font-bold px-2.5 py-1 text-[11px] rounded-full uppercase"
                >
                  {designation}
                </Badge>
              </TableCell>

              {/* Qualifications */}
              <TableCell>
                <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                  {qualification}
                </span>
              </TableCell>

              {/* Teaching Streams */}
              <TableCell>
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                  {streamsList.length > 0 ? (
                    streamsList.map((st, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800"
                      >
                        {st}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </div>
              </TableCell>

              {/* Experience */}
              <TableCell>
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                  {experience}
                </span>
              </TableCell>

              {/* Time Stamp */}
              <TableCell>
                <DateBox
                  created_at={item.created_at || item.createdAt}
                  updated_at={item.updated_at || item.updatedAt}
                />
              </TableCell>

              {/* Status Toggle */}
              <TableCell className="text-center">
                <ShowHideButton
                  id={item._id || item.slug || item.id}
                  status={item.status === 'active' || item.status === 1 || item.status === true || item.status === '1' || item.is_active === 1 || item.is_active === true ? 1 : 0}
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
