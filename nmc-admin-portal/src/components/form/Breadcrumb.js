import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ items = [], title }) => {
  const displayItems =
    items && items.length > 0
      ? items
      : title
      ? [
          { label: "Dashboard", link: "/dashboard" },
          { label: title },
        ]
      : [];

  return (
    <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
      {displayItems.map((item, index) => (
        <span key={index}>
          {item.link ? (
            <Link
              to={item.link}
              className="text-gray-500 dark:text-gray-400 hover:text-red-800 dark:hover:text-amber-400 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-800 dark:text-gray-200 font-semibold">{item.label}</span>
          )}
          {index < displayItems.length - 1 && " > "}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumb;
