import React, { useEffect } from 'react';
import {
  TableCell,
  TableBody,
  TableRow,
  TableHeader,
  Badge,
} from '@windmill/react-ui';
import EditDeleteButton from '../table/EditDeleteButton';
import DateBox from '../form/DateBox';
import ExpandableText from '../common/ExpandableText';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

const CourseTable = ({
  courses = [],
  currentPage = 1,
  resultsPerPage = 10,
  onEdit,
  onDelete,
}) => {
  const displayCourses = Array.isArray(courses) ? courses : [];
  const startIndex = (currentPage - 1) * resultsPerPage;

  useEffect(() => {
    Fancybox.bind('[data-fancybox]', {});
    return () => {
      Fancybox.unbind('[data-fancybox]');
      Fancybox.close();
    };
  }, []);


  return (
    <>
      <TableHeader>
        <tr>
          <TableCell>Sr. No.</TableCell>
          <TableCell>Image</TableCell>
          <TableCell>Course & Category</TableCell>
          <TableCell>Highlights & Fees</TableCell>
          <TableCell className="w-56">Description</TableCell>
          <TableCell>Time Stamp</TableCell>
          <TableCell className="text-right">Actions</TableCell>
        </tr>
      </TableHeader>

      <TableBody>
        {displayCourses.map((item, i) => {
          const itemKey = item.slug || item._id || item.id || i;
          const actionId = item.slug || item._id || item.id;
          const badgeText = item.badge || item.tag;
          const rawImg = item.imageUrl || item.image_url || item.image || '';
          const fallbackImg = 'https://runrkids.s3.ap-south-1.amazonaws.com/media/default/default.png';

          let img = fallbackImg;
          if (rawImg) {
            if (rawImg.startsWith('http://') || rawImg.startsWith('https://') || rawImg.startsWith('blob:')) {
              img = rawImg;
            } else {
              const backendBase = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
              let cleanPath = rawImg;
              if (!rawImg.startsWith('/')) {
                if (rawImg.startsWith('media/') || rawImg.startsWith('uploads/')) {
                  cleanPath = `/${rawImg}`;
                } else {
                  cleanPath = `/media/certificate_courses/${rawImg}`;
                }
              }
              img = `${backendBase}${cleanPath}`;
            }
          }



          return (
            <TableRow key={itemKey}>
              {/* Sr No */}
              <TableCell>
                <span className="text-xs uppercase font-semibold">
                  {startIndex + i + 1}
                </span>
              </TableCell>

              {/* Image */}
              <TableCell>
                <div className="flex items-center">
                  <div className="relative inline-block w-14 h-14 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 shadow-xs border border-gray-200 dark:border-gray-600">
                    <a data-fancybox="courses-gallery" href={img}>
                      <img
                        src={img}
                        alt={item.title || 'Course'}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = fallbackImg;
                        }}
                      />
                    </a>
                  </div>
                </div>
              </TableCell>


              {/* Course Title + Category + Tag/Badge Badges */}
              <TableCell>
                <div className="flex flex-col gap-1 max-w-xs">
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {item.title || '-'}
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                    {item.category && (
                      <Badge type="neutral" className="bg-red-50 text-red-800 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800 text-[10px] uppercase tracking-wider font-semibold">
                        {item.category}
                      </Badge>
                    )}
                    {badgeText && (
                      <Badge type="success" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px] font-semibold">
                        ⭐ {badgeText}
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>

              {/* Highlights & Duration / Fees */}
              <TableCell>
                <div className="flex flex-col gap-1.5 text-xs text-gray-700 dark:text-gray-300">
                  {Array.isArray(item.highlights) && item.highlights.length > 0 && (
                    <ul className="space-y-0.5">
                      {item.highlights.map((h, idx) => (
                        <li key={idx} className="flex items-start gap-1 text-[11px] text-gray-600 dark:text-gray-400">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 pt-1 border-t border-gray-100 dark:border-gray-700">
                    {item.duration && (
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        ⏱ {item.duration}
                      </span>
                    )}
                    {item.fees && (
                      <span className="font-semibold text-red-800 dark:text-red-400">
                        {item.fees}
                      </span>
                    )}
                  </div>
                </div>
              </TableCell>

              {/* Description with Reusable ExpandableText */}
              <TableCell className="w-56 max-w-xs whitespace-normal break-words">
                <ExpandableText text={item.description} />
              </TableCell>

              {/* Time Stamp with Dual Date Cards */}
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

export default React.memo(CourseTable);
