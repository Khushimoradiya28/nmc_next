import React from "react";

const DateCard = ({ date, title }) => {
  if (!date) return <span className="text-sm text-gray-500">-</span>;

  const d = new Date(date);
  const dateStr = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true
  });

  return (
    <div className="flex flex-col" title={title}>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {dateStr}
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {timeStr}
      </span>
    </div>
  );
};

const DateBox = ({ created_at, updated_at }) => {
  return (
    <div className="flex items-center gap-4">
      <DateCard date={created_at} title="Created At" />
      {updated_at && <DateCard date={updated_at} title="Updated At" />}
    </div>
  );
};

export default DateBox;
