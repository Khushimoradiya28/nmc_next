import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";

const CustomSelect = ({
  options = [],
  value = "",
  onChange,
  placeholder = "Select Option",
  className = "",
  width = "w-full",
  heightClass = "h-10",
  textSize = "text-xs",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value || opt === value);
  const selectedLabel = selectedOption
    ? typeof selectedOption === "object"
      ? selectedOption.label
      : selectedOption
    : placeholder;

  return (
    <div className={`relative inline-block ${width} ${className}`} ref={dropdownRef}>
      {/* Custom Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full ${heightClass} px-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md flex items-center justify-between ${textSize} text-gray-800 dark:text-gray-200 font-medium focus:outline-none focus:border-red-600 transition-colors shadow-xs`}
      >
        <span className="truncate">{selectedLabel}</span>
        <FiChevronDown
          size={14}
          className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 ml-2 shrink-0 ${
            isOpen ? "transform rotate-180 text-red-600" : ""
          }`}
        />
      </button>

      {/* Custom Dropdown Options Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto py-1 animate-fadeIn">
          {options.map((opt, idx) => {
            const optVal = typeof opt === "object" ? opt.value : opt;
            const optLabel = typeof opt === "object" ? opt.label : opt;
            const isSelected = optVal === value;

            return (
              <div
                key={idx}
                onClick={() => {
                  if (onChange) onChange(optVal);
                  setIsOpen(false);
                }}
                className={`px-3 py-2 ${textSize} cursor-pointer flex items-center justify-between transition-colors ${
                  isSelected
                    ? "bg-red-800 text-white font-semibold"
                    : "text-gray-700 dark:text-gray-200 hover:bg-red-50 hover:text-red-800 dark:hover:bg-gray-700 dark:hover:text-red-400"
                }`}
              >
                <span>{optLabel}</span>
                {isSelected && <FiCheck size={14} className="text-white ml-2 shrink-0" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
