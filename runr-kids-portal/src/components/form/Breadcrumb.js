import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ items = [] }) => {
  return (
    <div className="text-sm text-gray-500 mb-2">
      {items.map((item, index) => (
        <span key={index}>
          {item.link ? (
            <Link to={item.link} className="text-white-600 hover:text-green-400">
              {item.label}
            </Link>
          ) : (
            item.label
          )}
          {index < items.length - 1 && " > "}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumb;
