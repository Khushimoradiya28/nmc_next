// import React from 'react'

// const Chart = ({ children, title }) => {
//   return (
//     <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
//       <p className="mb-4 font-semibold text-gray-800 dark:text-gray-300">{title}</p>
//       {children}
//     </div>
//   )
// }

// export default Chart
import React from "react";

const Chart = ({ children, title, action }) => {
  return (
    <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold text-gray-800 dark:text-gray-300">
          {title}
        </p>

        {/* 3 DOT MENU */}
        {action && <div>{action}</div>}
      </div>

      {/* CONTENT */}
      {children}
    </div>
  );
};

export default Chart;
