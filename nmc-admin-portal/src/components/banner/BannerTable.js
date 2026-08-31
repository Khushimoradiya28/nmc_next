import React from 'react';
import { TableBody, TableRow, TableCell } from '@windmill/react-ui';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { BsToggleOff, BsToggleOn } from 'react-icons/bs';
import DateBox from '../form/DateBox';

const BannerTable = ({
  banners = [],
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <TableBody>
      {banners.map((item, index) => {
        const itemId = item._id || item.id;
        const isActive = item.status === 'active' || item.isActive === true || item.status === true;
        const imgSrc = item.image_webp_url || item.image_url || item.image;
        const fallbackImg = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80';

        return (
          <TableRow
            key={itemId || index}
            className='hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
          >
            {/* 1. SR. NO. */}
            <TableCell>
              <span className='text-xs uppercase font-semibold text-gray-600 dark:text-gray-400'>
                {index + 1}
              </span>
            </TableCell>

            {/* 2. BANNER IMAGE PREVIEW */}
            <TableCell>
              <div className='w-28 h-14 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shrink-0 shadow-xs my-1'>
                <img
                  src={imgSrc || fallbackImg}
                  alt={item.title || 'Banner Slide'}
                  className='w-full h-full object-cover'
                  onError={(e) => {
                    e.target.src = fallbackImg;
                  }}
                />
              </div>
            </TableCell>

            {/* 3. TITLE */}
            <TableCell>
              <span className='text-xs font-semibold text-gray-800 dark:text-gray-200 block max-w-xs truncate'>
                {item.title || 'Untitled Banner'}
              </span>
            </TableCell>

            {/* 4. ACTIVE STATUS TOGGLE */}
            <TableCell className='text-center'>
              <span
                className='cursor-pointer text-2xl inline-flex items-center justify-center'
                onClick={() => onToggleStatus && onToggleStatus(item)}
                title={isActive ? 'Deactivate Banner Image' : 'Activate Banner Image'}
              >
                {isActive ? (
                  <BsToggleOn className='text-red-800' />
                ) : (
                  <BsToggleOff className='text-orange-500' />
                )}
              </span>
            </TableCell>

            {/* 5. TIME STAMP */}
            <TableCell>
              <DateBox
                created_at={item.created_at || item.createdAt}
                updated_at={item.updated_at || item.updatedAt}
              />
            </TableCell>

            {/* 6. ACTIONS */}
            <TableCell className='text-right'>
              <div className='flex items-center justify-end gap-1'>
                <button
                  type='button'
                  onClick={() => onEdit && onEdit(item)}
                  className='p-2 text-gray-500 hover:text-red-800 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none'
                  title='Edit Banner Image'
                >
                  <FiEdit className='w-4 h-4' />
                </button>
                <button
                  type='button'
                  onClick={() => onDelete && onDelete(itemId)}
                  className='p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none'
                  title='Delete Banner Image'
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

export default BannerTable;
