import React from 'react';
import {
  TableBody,
  TableRow,
  TableCell,
} from '@windmill/react-ui';
import { FiVideo, FiImage, FiPlay, FiEdit, FiTrash2 } from 'react-icons/fi';
import { BsToggleOff, BsToggleOn } from 'react-icons/bs';
import DateBox from '../form/DateBox';

const categoryDisplayMap = {
  campus_labs: 'Campus & Labs',
  events_culture: 'Events & Culture',
  video_highlights: 'Video Highlights',
  'Campus & Labs': 'Campus & Labs',
  'Events & Culture': 'Events & Culture',
  'Video Highlights': 'Video Highlights',
};

const GalleryTable = ({
  items = [],
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <TableBody>
      {items.map((item, index) => {
        const itemId = item._id || item.id;
        const isActive = item.status === 'active' || item.isActive === true || item.status === true;
        const mediaType = item.media_type || item.mediaType || 'image';
        const imgSrc = item.thumbnail_url || item.thumbnail || item.media_url || item.mediaUrl || item.image_webp_url;
        const displayCategory = categoryDisplayMap[item.category] || item.category || 'Campus & Labs';
        const displayTitle = item.badge_title || item.badgeTitle || item.title || 'Gallery';
        const displayDescription = item.description || 'No description provided';

        return (
          <TableRow key={itemId || index} className='hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'>
            {/* 1. SR. NO. */}
            <TableCell>
              <span className='text-xs uppercase font-semibold text-gray-600 dark:text-gray-400'>
                {index + 1}
              </span>
            </TableCell>

            {/* 2. MEDIA PREVIEW */}
            <TableCell>
              <div className='relative w-20 h-14 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shrink-0 shadow-xs'>
                <img
                  src={imgSrc}
                  alt={displayTitle}
                  className='w-full h-full object-cover'
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=300&q=80';
                  }}
                />
                {mediaType === 'video' && (
                  <div className='absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center'>
                    <div className='w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md'>
                      <FiPlay size={10} className='ml-0.5' />
                    </div>
                  </div>
                )}
                {/* Badge Tag Overlay */}
                <span className='absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded backdrop-blur-xs'>
                  {displayTitle}
                </span>
              </div>
            </TableCell>

            {/* 3. DETAILS */}
            <TableCell>
              <span className='font-semibold text-xs text-gray-800 dark:text-gray-200 block truncate max-w-xs'>
                {displayTitle}
              </span>
            </TableCell>

            {/* 4. CATEGORY */}
            <TableCell>
              <span className='inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-md bg-red-50 text-red-800 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800'>
                {displayCategory}
              </span>
            </TableCell>

            {/* 5. MEDIA TYPE BADGES */}
            <TableCell>
              {mediaType === 'video' ? (
                <span className='inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-md bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800'>
                  <FiVideo size={12} className='mr-1.5' /> Video
                </span>
              ) : (
                <span className='inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800'>
                  <FiImage size={12} className='mr-1.5' /> Photo
                </span>
              )}
            </TableCell>

            {/* 6. STATUS */}
            <TableCell className='text-center'>
              <span
                className='cursor-pointer text-xl flex justify-center'
                onClick={() => onToggleStatus && onToggleStatus(item)}
                title={isActive ? 'Deactivate' : 'Activate'}
              >
                {isActive ? (
                  <BsToggleOn className='text-red-800' />
                ) : (
                  <BsToggleOff className='text-orange-500' />
                )}
              </span>
            </TableCell>

            {/* 7. TIME STAMP */}
            <TableCell>
              <DateBox
                created_at={item.created_at || item.createdAt}
                updated_at={item.updated_at || item.updatedAt}
              />
            </TableCell>

            {/* 8. ACTIONS */}
            <TableCell className='text-right'>
              <div className='flex items-center justify-end gap-1'>
                <button
                  type='button'
                  onClick={() => onEdit && onEdit(item)}
                  className='p-2 text-gray-500 hover:text-red-800 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none'
                  title='Edit'
                >
                  <FiEdit className='w-4 h-4' />
                </button>
                <button
                  type='button'
                  onClick={() => onDelete && onDelete(itemId)}
                  className='p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none'
                  title='Delete'
                >
                  <FiTrash2 className='w-4 h-4' />
                </button>
              </div>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
};

export default GalleryTable;
