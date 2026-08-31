import React from "react";

const LetterAvatar = ({ name = "", size = 42, className = "" }) => {
  const cleanName = (name || "").trim();
  const initial = cleanName ? cleanName.charAt(0).toUpperCase() : "U";

  const colors = [
    "bg-red-600 text-white",
    "bg-blue-600 text-white",
    "bg-emerald-600 text-white",
    "bg-amber-600 text-white",
    "bg-purple-600 text-white",
    "bg-indigo-600 text-white",
    "bg-teal-600 text-white",
  ];

  let hash = 0;
  for (let i = 0; i < cleanName.length; i++) {
    hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorClass = colors[Math.abs(hash) % colors.length];

  return (
    <div
      style={{ width: size + "px", height: size + "px", fontSize: Math.round(size * 0.42) + "px" }}
      className={"inline-flex items-center justify-center font-bold rounded-full select-none shadow-xs shrink-0 " + colorClass + " " + className}
    >
      {initial}
    </div>
  );
};

export default LetterAvatar;
