import React from 'react';
import {
  TableCell,
  TableBody,
  TableRow,
  TableHeader,
  Badge,
  Avatar,
} from '@windmill/react-ui';
import EditDeleteButton from '../table/EditDeleteButton';
import ExpandableText from '../common/ExpandableText';
import DateBox from '../form/DateBox';

const DEFAULT_TESTIMONIALS = [
  {
    _id: 'sample_testimonial_1',
    type: 'dignitary',
    authorName: 'Priyaba Gohil',
    designationSubtext: 'Trustee & Academic Director',
    title: 'Excellence in Campus Education',
    quote: 'Our mission is to empower students with modern skills and high moral values through quality training.',
    rating: 5,
    avatarUrl: '',
    createdAt: '2026-06-17T10:00:00.000Z',
    updatedAt: '2026-08-07T14:30:00.000Z',
  },
];

// QuoteCell Component using reusable ExpandableText
const QuoteCell = ({ title, quote }) => {
  return (
    <div className="w-64 max-w-xs whitespace-normal break-words">
      {title && (
        <div className="text-xs font-bold text-gray-900 dark:text-gray-100 mb-0.5 whitespace-normal break-words">
          {title}
        </div>
      )}
      <ExpandableText text={`"${quote || '-'}"`} />
    </div>
  );
};

const TestimonialTable = ({
  testimonials = [],
  currentPage = 1,
  resultsPerPage = 10,
  onEdit,
  onDelete,
}) => {
  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;
  const startIndex = (currentPage - 1) * resultsPerPage;

  // Helper to generate initials from name (e.g. "Priyaba Gohil" -> "PG")
  const getInitials = (name) => {
    if (!name) return 'ST';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <>
      <TableHeader>
        <tr>
          <TableCell>Sr. No.</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Author / Student</TableCell>
          <TableCell>Designation / Subtext</TableCell>
          <TableCell className="w-64">Title / Quote</TableCell>
          <TableCell>Rating</TableCell>
          <TableCell>Time Stamp</TableCell>
          <TableCell className="text-right">Actions</TableCell>
        </tr>
      </TableHeader>

      <TableBody>
        {displayTestimonials.map((item, i) => (
          <TableRow key={item._id || i}>
            {/* Sr No */}
            <TableCell>
              <span className="text-xs uppercase font-semibold">
                {startIndex + i + 1}
              </span>
            </TableCell>

            {/* Type */}
            <TableCell>
              {item.type === 'dignitary' ? (
                <Badge type="neutral" className="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                  Dignitary
                </Badge>
              ) : (
                <Badge type="success" className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                  Student
                </Badge>
              )}
            </TableCell>

            {/* Author / Student */}
            <TableCell>
              <div className="flex items-center gap-3">
                {item.type === 'dignitary' && item.avatarUrl ? (
                  <Avatar
                    src={item.avatarUrl}
                    alt={item.authorName}
                    size="regular"
                    className="shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-red-800 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                    {getInitials(item.authorName)}
                  </div>
                )}
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {item.authorName || '-'}
                </span>
              </div>
            </TableCell>

            {/* Designation / Subtext */}
            <TableCell>
              <span className="text-xs text-gray-600 dark:text-gray-300">
                {item.designationSubtext || '-'}
              </span>
            </TableCell>

            {/* Title / Quote with Read More toggle */}
            <TableCell className="w-64 max-w-xs whitespace-normal break-words">
              <QuoteCell title={item.title} quote={item.quote} />
            </TableCell>

            {/* Rating */}
            <TableCell>
              {item.type === 'student' ? (
                <span className="text-xs font-semibold text-amber-500">
                  {'⭐'.repeat(item.rating || 5)} ({item.rating || 5}/5)
                </span>
              ) : (
                <span className="text-xs text-gray-400">-</span>
              )}
            </TableCell>

            {/* Time Stamp */}
            <TableCell>
              <DateBox
                created_at={item.createdAt || item.created_at}
                updated_at={item.updatedAt || item.updated_at}
              />
            </TableCell>

            {/* Actions */}
            <TableCell>
              <div className="flex items-center justify-end gap-2">
                <EditDeleteButton
                  id={item._id}
                  handleUpdate={() => onEdit && onEdit(item._id)}
                  handleModalOpen={() => onDelete && onDelete(item._id)}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default React.memo(TestimonialTable);
