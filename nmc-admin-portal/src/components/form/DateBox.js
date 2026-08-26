import React from "react";

const DateCard = ({ date, title }) => {
  if (!date) return <span className="text-xs text-gray-400">-</span>;

  const d = new Date(date);
  if (isNaN(d.getTime())) return <span className="text-xs text-gray-400">-</span>;

  const dayMonth = d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
  const year = d.getFullYear();

  return (
    <div
      className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-2.5 py-1 text-center min-w-[62px] inline-block shadow-2xs"
      title={title}
    >
      <div className="text-xs font-bold text-gray-900 dark:text-gray-100 leading-tight">
        {dayMonth}
      </div>
      <div className="text-[11px] font-normal text-gray-400 dark:text-gray-400 leading-tight mt-0.5">
        {year}
      </div>
    </div>
  );
};

const DateBox = ({ created_at, updated_at }) => {
  const createdDate = created_at || new Date().toISOString();
  const updatedDate = updated_at || createdDate;

  return (
    <div className="flex items-center gap-1.5">
      <DateCard date={createdDate} title="Created At" />
      <DateCard date={updatedDate} title="Updated At" />
    </div>
  );
};

export default DateBox;
