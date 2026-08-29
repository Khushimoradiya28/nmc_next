import React, { useState } from 'react';
import {
  TableCell,
  TableBody,
  TableRow,
  TableHeader,
  Badge,
} from '@windmill/react-ui';
import EditDeleteButton from '../table/EditDeleteButton';
import ShowHideButton from '../table/ShowHideButton';
import ExpandableText from '../common/ExpandableText';
import DateBox from '../form/DateBox';

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

const resolveImageSrc = (imageUrl) => {
  if (!imageUrl) return '';
  const clean = imageUrl.trim();
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('blob:')) {
    return clean;
  }
  const backendBase = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
  let cleanPath = clean;
  if (!clean.startsWith('/')) {
    if (clean.startsWith('media/') || clean.startsWith('uploads/')) {
      cleanPath = `/${clean}`;
    } else {
      cleanPath = `/media/certificate_courses/${clean}`;
    }
  }
  return `${backendBase}${cleanPath}`;
};

const TestimonialAvatar = ({ item, getInitials }) => {
  const [imgError, setImgError] = useState(false);
  const rawAvatar = (item.avatarUrl || item.avatar || item.image || item.image_url || '').trim();
  const avatarSrc = resolveImageSrc(rawAvatar);

  if (item.type === 'dignitary' && rawAvatar && !imgError) {
    return (
      <img
        src={avatarSrc}
        alt={item.authorName || 'Avatar'}
        className="w-8 h-8 rounded-full object-cover shrink-0 border border-gray-200 dark:border-gray-600 shadow-sm"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div className="w-8 h-8 rounded-full bg-red-800 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
      {getInitials(item.authorName)}
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
  const displayTestimonials = Array.isArray(testimonials) ? testimonials : [];
  const startIndex = (currentPage - 1) * resultsPerPage;

  const getInitials = (name) => {
    if (!name) return 'D';
    const parts = name.trim().split(/\s+/).filter(Boolean);
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
          <TableCell className="text-center">Status</TableCell>
          <TableCell className="text-right">Actions</TableCell>
        </tr>
      </TableHeader>

      <TableBody>
        {displayTestimonials.map((item, i) => {
          const itemKey = item.slug || item._id || item.id || i;
          const actionId = item.slug || item._id || item.id;
          const isActuallyActive = item.isActive === true || item.isActive === 'true' || item.isActive === 1 || item.isActive === '1';
          const statusVal = isActuallyActive && item.status !== 'inactive' ? 1 : 0;

          return (
            <TableRow key={itemKey}>
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
                  <TestimonialAvatar item={item} getInitials={getInitials} />
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
                    {'★'.repeat(item.rating || 5)} ({item.rating || 5}/5)
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

              {/* Status Toggle */}
              <TableCell className="text-center">
                <ShowHideButton
                  id={actionId}
                  status={statusVal}
                  type="testimonial"
                />
              </TableCell>

              {/* Actions */}
              <TableCell>
                <div className="flex items-center justify-end gap-2">
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

export default React.memo(TestimonialTable);

