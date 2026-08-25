import React from "react";
import { FiEye } from "react-icons/fi";

const ViewButton = ({ id, onView }) => {
  return (
    <div
      onClick={() => onView(id)}
      className="p-2 rounded-lg bg-red-800 text-white hover:bg-red-900 transition flex cursor-pointer"
    >
      <FiEye size={18} />
    </div>
  );
};

export default ViewButton;

