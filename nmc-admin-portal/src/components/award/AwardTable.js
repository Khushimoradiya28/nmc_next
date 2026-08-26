import React, { useEffect } from 'react';
import {
  TableCell,
  TableBody,
  TableRow,
  TableHeader,
} from '@windmill/react-ui';
import EditDeleteButton from '../table/EditDeleteButton';
import DateBox from '../form/DateBox';
import ExpandableText from '../common/ExpandableText';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

const AwardTable = ({
  awards = [],
  currentPage = 1,
  resultsPerPage = 10,
  onEdit,
  onDelete,
}) => {
  const displayAwards = Array.isArray(awards) ? awards : [];
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
          <TableCell>Award Title</TableCell>
          <TableCell className="w-64">Description / Subtext</TableCell>
          <TableCell>Time Stamp</TableCell>
          <TableCell className="text-right">Actions</TableCell>
        </tr>
      </TableHeader>

      <TableBody>
        {displayAwards.map((item, i) => {
          const itemKey = item.slug || item._id || item.id || i;
          const actionId = item.slug || item._id || item.id;
          const rawImg = item.image_url || item.imageUrl || item.image || '';
          const fallbackImg = 'https://runrkids.s3.ap-south-1.amazonaws.com/media/default/default.png';
          
          let img = fallbackImg;
          if (rawImg) {
            if (rawImg.startsWith('http://') || rawImg.startsWith('https://') || rawImg.startsWith('blob:')) {
              img = rawImg;
            } else {
              const backendBase = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
              const cleanPath = rawImg.startsWith('/') ? rawImg : rawImg.startsWith('uploads/') ? `/${rawImg}` : `/uploads/${rawImg}`;
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

              {/* Award Image */}
              <TableCell>
                <div className="flex items-center">
                  <div className="relative inline-block w-12 h-12 rounded overflow-hidden bg-gray-100 dark:bg-gray-700 shadow-xs border border-gray-200 dark:border-gray-600">
                    <a data-fancybox="awards-gallery" href={img}>
                      <img
                        src={img}
                        alt={item.title || 'Award'}
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


              {/* Title */}
              <TableCell>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {item.title || '-'}
                </span>
              </TableCell>

              {/* Description with Reusable ExpandableText component */}
              <TableCell className="w-64 max-w-xs whitespace-normal break-words">
                <ExpandableText text={item.description} />
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

export default React.memo(AwardTable);
