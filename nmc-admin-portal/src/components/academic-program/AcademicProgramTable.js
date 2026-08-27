import React from 'react';
import {
  TableCell,
  TableBody,
  TableRow,
  TableHeader,
  Badge,
} from '@windmill/react-ui';
import { FiEye } from 'react-icons/fi';
import EditDeleteButton from '../table/EditDeleteButton';
import ShowHideButton from '../table/ShowHideButton';
import DateBox from '../form/DateBox';

const formatFee = (val) => {
  if (!val) return 'N/A';
  const str = String(val).trim();
  if (str.startsWith('₹') || str.startsWith('Rs.') || str.startsWith('Rs')) {
    return str;
  }
  return `₹${str}`;
};

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

  const getProgramTypeBadge = (programType) => {
    switch (programType?.toLowerCase()) {
      case 'ug':
        return (
          <Badge type="danger" className="bg-red-50 text-red-800 dark:bg-red-950/60 dark:text-red-300 font-bold px-2.5 py-1 text-[11px] rounded-full uppercase">
            Undergraduate (UG)
          </Badge>
        );
      case 'pg':
        return (
          <Badge type="primary" className="bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 font-bold px-2.5 py-1 text-[11px] rounded-full uppercase">
            Postgraduate (PG)
          </Badge>
        );
      case 'diploma':
        return (
          <Badge type="warning" className="bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold px-2.5 py-1 text-[11px] rounded-full uppercase">
            Diploma & Vocational
          </Badge>
        );
      default:
        return (
          <Badge type="neutral" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 font-bold px-2.5 py-1 text-[11px] rounded-full uppercase">
            {programType?.toUpperCase() || 'PROGRAM'}
          </Badge>
        );
    }
  };

  return (
    <>
      <TableHeader>
        <tr>
          <TableCell>Sr. No.</TableCell>
          <TableCell>Program Details</TableCell>
          <TableCell>Program Type</TableCell>
          <TableCell>Duration & Fees</TableCell>
          <TableCell>Highlights</TableCell>
          <TableCell>Time Stamp</TableCell>
          <TableCell className="text-center">Status</TableCell>
          <TableCell className="text-right">Actions</TableCell>
        </tr>
      </TableHeader>

      <TableBody>
        {displayPrograms.map((item, i) => {
          const actionId = item.slug || item._id || item.id;
          const statusVal = item.status === 'active' || item.status === 1 ? 1 : 0;
          const feeDisplay = formatFee(item.fees || item.fee);

          return (
            <TableRow key={actionId || i}>
              {/* Sr No */}
              <TableCell>
                <span className="text-xs font-semibold text-gray-500">
                  {startIndex + i + 1}
                </span>
              </TableCell>

              {/* Program Name & Badge */}
              <TableCell>
                <div className="flex flex-col gap-1 max-w-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {item.shortTitle || item.shortName || '-'}
                    </span>
                    {item.degreeBadge && (
                      <span className="text-[10px] bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 font-semibold px-2 py-0.5 rounded">
                        {item.degreeBadge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                    {item.fullName || '-'}
                  </span>
                </div>
              </TableCell>

              {/* Program Type */}
              <TableCell>
                {getProgramTypeBadge(item.programType || item.category)}
              </TableCell>

              {/* Duration & Fees with static ₹ symbol */}
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                    ⏱ {item.duration || 'N/A'}
                  </span>
                  <span className="text-[11px] font-bold text-red-800 dark:text-red-400 mt-0.5">
                    💰 {feeDisplay}
                  </span>
                </div>
              </TableCell>

              {/* Highlights */}
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

              {/* Time Stamp */}
              <TableCell>
                <DateBox
                  created_at={item.createdAt || item.created_at}
                  updated_at={item.updatedAt || item.updated_at}
                />
              </TableCell>

              {/* Status Toggle */}
              <TableCell className="text-center">
                <ShowHideButton
                  id={actionId}
                  status={statusVal}
                  type="academicProgram"
                />
              </TableCell>

              {/* Actions */}
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onViewDetails && onViewDetails(item)}
                    className="p-2 text-gray-400 hover:text-red-800 dark:hover:text-red-400 rounded-lg transition-colors"
                    title="View Program Details"
                  >
                    <FiEye className="w-4 h-4" />
                  </button>

                  <EditDeleteButton
                    id={actionId}
                    handleUpdate={() => onEdit && onEdit(actionId)}
                    handleModalOpen={() => onDelete && onDelete(actionId)}
                  />
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
