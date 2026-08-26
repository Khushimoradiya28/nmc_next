import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiCheck } from 'react-icons/fi';

/**
 * CustomSelect - Reusable, customizable dropdown component for forms
 * 
 * @param {Array} options - List of options: [{ label: string, value: any, icon?: ReactNode }] or ['val1', 'val2']
 * @param {any} value - Currently selected value
 * @param {Function} onChange - Change handler (newValue, optionObj) => void
 * @param {string} placeholder - Placeholder text when no selection
 * @param {string} className - Additional CSS classes for the container
 * @param {boolean} disabled - Disable the dropdown
 * @param {string} name - Field name for react-hook-form or native forms
 * @param {Function} register - react-hook-form register function (optional)
 * @param {boolean} required - Form required validation
 */
const CustomSelect = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  disabled = false,
  name,
  register,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Normalize options array into [{ label, value, icon }]
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return {
        label: opt.label ?? opt.name ?? String(opt.value),
        value: opt.value,
        icon: opt.icon || null,
        subtext: opt.subtext || null,
      };
    }
    return { label: String(opt), value: opt, icon: null, subtext: null };
  });

  // Find currently selected option
  const selectedOption = normalizedOptions.find(
    (opt) => String(opt.value) === String(value)
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    if (disabled) return;
    setIsOpen(false);
    if (onChange) {
      onChange(option.value, option);
    }
  };

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      {/* Hidden input for react-hook-form integration if register is supplied */}
      {register && name && (
        <input
          type="hidden"
          {...register(name, {
            required: required ? 'This field is required' : false,
          })}
          value={value !== undefined && value !== null ? value : ''}
        />
      )}

      {/* Select Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full h-12 px-4 text-left text-sm font-medium rounded-md border flex items-center justify-between transition-all duration-200 focus:outline-none ${
          disabled
            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500'
            : isOpen
            ? 'border-red-600 bg-white shadow-sm ring-1 ring-red-600 dark:bg-gray-700 dark:border-red-500 dark:text-gray-100'
            : 'border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-50 focus:border-red-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-650'
        }`}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.icon && <span>{selectedOption.icon}</span>}
          {selectedOption ? (
            <span className="truncate">{selectedOption.label}</span>
          ) : (
            <span className="text-gray-400 dark:text-gray-400">{placeholder}</span>
          )}
        </span>

        <FiChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 dark:text-gray-400 shrink-0 ${
            isOpen ? 'rotate-180 text-red-600 dark:text-red-400' : ''
          }`}
        />
      </button>

      {/* Options Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto py-1 animate-fadeIn focus:outline-none">
          {normalizedOptions.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
              No options available
            </div>
          ) : (
            normalizedOptions.map((option, index) => {
              const isSelected = String(option.value) === String(value);
              return (
                <div
                  key={`${option.value}-${index}`}
                  onClick={() => handleSelect(option)}
                  className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-red-50 text-red-700 font-semibold dark:bg-red-900/30 dark:text-red-400'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {option.icon && <span className="shrink-0">{option.icon}</span>}
                    <div className="flex flex-col truncate">
                      <span className="truncate">{option.label}</span>
                      {option.subtext && (
                        <span className="text-xs text-gray-400 dark:text-gray-500 font-normal">
                          {option.subtext}
                        </span>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <FiCheck className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 ml-2" />
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
