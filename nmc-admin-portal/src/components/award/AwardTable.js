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

const DEFAULT_AWARDS = [
  {
    _id: 'sample_award_1',
    title: "Best Women's College Recognition",
    description: "Empowering women through quality education and holistic growth across academic excellence and student welfare.",
    imageUrl: 'https://runrkids.s3.ap-south-1.amazonaws.com/media/default/default.png',
    createdAt: '2026-06-17T10:00:00.000Z',
    updatedAt: '2026-08-07T14:30:00.000Z',
  },
];

const AwardTable = ({
  awards = [],
  currentPage = 1,
  resultsPerPage = 10,
  onEdit,
  onDelete,
}) => {
  const displayAwards = awards && awards.length > 0 ? awards : DEFAULT_AWARDS;
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
        {displayAwards.map((item, i) => (
          <TableRow key={item._id || i}>
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
                  <a
                    data-fancybox="awards-gallery"
                    href={
                      item.imageUrl ||
                      'https://runrkids.s3.ap-south-1.amazonaws.com/media/default/default.png'
                    }
                  >
                    <img
                      src={
                        item.imageUrl ||
                        'https://runrkids.s3.ap-south-1.amazonaws.com/media/default/default.png'
                      }
                      alt={item.title}
                      className="object-cover w-full h-full"
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

export default React.memo(AwardTable);
