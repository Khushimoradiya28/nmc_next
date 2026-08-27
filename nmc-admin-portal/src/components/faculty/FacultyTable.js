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
          <TableCell className="text-right">Actions</TableCell>
        </tr>
      </TableHeader>

      <TableBody>
        {displayFaculties.map((item, i) => {
          return (
            <TableRow key={item.id || i}>
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
                    src={item.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={item.name}
                    size="regular"
                    className="shrink-0 rounded-xl"
                  />
                  <div>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100 block">
                      {item.name}
                    </span>
                    {item.highlight && (
                      <span className="text-[11px] text-amber-600 dark:text-amber-400 truncate max-w-xs block font-medium">
                        ✨ {item.highlight}
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
                  {item.badge || 'FACULTY'}
                </Badge>
              </TableCell>

              {/* Designation & Qualification */}
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                    {item.designation}
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    {item.qualification}
                  </span>
                </div>
              </TableCell>

              {/* Experience & Stream */}
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                    {item.experience || 'N/A'}
                  </span>
                  <span className="text-[11px] font-bold text-red-800 dark:text-red-400">
                    Stream: {item.stream || 'B.B.A.'}
                  </span>
                </div>
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
                    className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
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
