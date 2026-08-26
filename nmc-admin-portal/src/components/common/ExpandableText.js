import React, { useState } from 'react';

/**
 * Reusable ExpandableText Component
 * Clamps text to max lines (default 2) and provides a Read More / Read Less toggle.
 * Expands strictly downward line-by-line without stretching layout horizontally.
 */
const ExpandableText = ({
  text = '',
  maxLines = 2,
  limitChar = 70,
  className = '',
}) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = (text || '').length > limitChar;

  return (
    <div className="w-64 max-w-xs whitespace-normal break-words">
      <p
        className={`text-xs text-gray-600 dark:text-gray-300 whitespace-normal break-words leading-relaxed ${className} ${
          !expanded ? `line-clamp-${maxLines}` : ''
        }`}
      >
        {text || '-'}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="text-[11px] text-red-800 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-semibold mt-1 focus:outline-none cursor-pointer hover:underline block"
        >
          {expanded ? 'Read Less' : 'Read More'}
        </button>
      )}
    </div>
  );
};

export default ExpandableText;
