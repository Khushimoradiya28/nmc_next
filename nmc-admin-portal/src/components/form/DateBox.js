import React from 'react';

const DateCard = ({ date, title, align = 'center' }) => {
  if (!date) return <span className='text-xs text-gray-400'>-</span>;

  const d = new Date(date);
  if (isNaN(d.getTime())) return <span className='text-xs text-gray-400'>-</span>;

  const dayMonth = d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
  });
  const year = d.getFullYear();

  const fullDateTime = d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className='relative group inline-block'>
      <div
        className='border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-2.5 py-1 text-center min-w-[60px] cursor-pointer shadow-2xs transition-colors duration-150 hover:border-red-500 dark:hover:border-red-400'
        title={title + ': ' + fullDateTime}
      >
        <div className='text-xs font-bold text-gray-900 dark:text-gray-100 leading-tight'>
          {dayMonth}
        </div>
        <div className='text-[11px] font-normal text-gray-400 dark:text-gray-400 leading-tight mt-0.5'>
          {year}
        </div>
      </div>

      <div
        className={'absolute bottom-full mb-1.5 hidden group-hover:flex flex-col z-50 pointer-events-none ' + (
          align === 'right'
            ? 'right-0 items-end'
            : align === 'left'
            ? 'left-0 items-start'
            : 'left-1/2 -translate-x-1/2 items-center'
        )}
      >
        <div className='bg-gray-900 text-white text-[11px] font-medium py-1 px-2.5 rounded shadow-xl whitespace-nowrap border border-gray-700'>
          <span className='text-gray-400 mr-1'>{title}:</span>
          <span className='text-gray-100'>{fullDateTime}</span>
        </div>
        <div
          className={'w-2 h-2 -mt-1 rotate-45 bg-gray-900 border-r border-b border-gray-700 ' + (
            align === 'right' ? 'mr-4' : align === 'left' ? 'ml-4' : ''
          )}
        ></div>
      </div>
    </div>
  );
};

const DateBox = ({ created_at, updated_at, createdAt, updatedAt }) => {
  const actualCreated = created_at || createdAt;
  const actualUpdated = updated_at || updatedAt || actualCreated;

  return (
    <div className='flex items-center gap-1.5'>
      <DateCard date={actualCreated} title='Created At' align='center' />
      <DateCard date={actualUpdated} title='Updated At' align='right' />
    </div>
  );
};

export default DateBox;
