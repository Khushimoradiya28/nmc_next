import React from "react";
import { FiEye } from "react-icons/fi";

const ViewButton = ({ id, onView }) => {
  return (
    <div
      onClick={() => onView(id)}
      className="p-2 rounded-lg bg-green-600 text-white transition flex text-white-400 cursor-pointer"
    >
      <FiEye size={18} />
    </div>
  );
};

export default ViewButton;

