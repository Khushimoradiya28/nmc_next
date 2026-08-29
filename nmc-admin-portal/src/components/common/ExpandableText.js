import React, { useState } from 'react';

/**
 * Reusable ExpandableText Component
 * Truncates text by character count and provides a working Read More / Read Less toggle.
 * Expands strictly downward line-by-line without stretching layout horizontally.
 */
const ExpandableText = ({
  text = '',
  limitChar = 65,
  className = '',
}) => {
  const [expanded, setExpanded] = useState(false);
  const cleanText = text || '';
  const isLong = cleanText.length > limitChar;

  const displayText = expanded || !isLong
    ? cleanText
    : `${cleanText.slice(0, limitChar).trim()}...`;

  return (
    <div className="w-64 max-w-xs whitespace-normal break-words">
      <p
        className={`text-xs text-gray-600 dark:text-gray-300 whitespace-normal break-words leading-relaxed ${className}`}
      >
        {displayText || '-'}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((prev) => !prev);
          }}
          className="text-[11px] text-red-800 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-semibold mt-1 focus:outline-none cursor-pointer hover:underline inline-block"
        >
          {expanded ? 'Read Less' : 'Read More'}
        </button>
      )}
    </div>
  );
};

export default ExpandableText;
