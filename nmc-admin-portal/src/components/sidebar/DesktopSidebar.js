import React, { useContext } from "react";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import SidebarContent from "./SidebarContent";
import { SidebarContext } from "../../context/SidebarContext";

const DesktopSidebar = () => {
  const { isCollapsed, setIsCollapsed, isPinned, setIsPinned } = useContext(SidebarContext);

  const handleMouseEnter = () => {
    if (!isPinned) {
      setIsCollapsed(false);
    }
  };

  const handleMouseLeave = () => {
    if (!isPinned) {
      setIsCollapsed(true);
    }
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    if (isPinned) {
      setIsPinned(false);
      setIsCollapsed(true);
    } else {
      setIsPinned(true);
      setIsCollapsed(false);
    }
  };

  return (
    <div
      className="relative z-30 hidden lg:block flex-shrink-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <aside
        className={`h-full shadow-[4px_0_25px_-2px_rgba(0,0,0,0.08)] dark:shadow-[4px_0_25px_-2px_rgba(0,0,0,0.5)] border-r border-gray-100 dark:border-gray-800/80 overflow-y-auto no-scrollbar custom-scrollbar-none bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <SidebarContent isCollapsed={isCollapsed} />
      </aside>

      {/* Toggle Pin & Collapse Button */}
      <button
        type="button"
        onClick={handleToggle}
        className={`absolute bottom-6 -right-3.5 z-40 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none shadow-md hover:shadow-lg transform hover:scale-110 cursor-pointer ${
          isPinned
            ? 'bg-red-800 text-white hover:bg-red-900 dark:bg-red-900 dark:hover:bg-red-950'
            : 'bg-white text-gray-700 border border-gray-200 hover:bg-red-800 hover:text-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-red-900 dark:hover:text-white'
        }`}
        title={isPinned ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isCollapsed ? (
          <FiChevronRight className="w-4 h-4" />
        ) : (
          <FiChevronLeft className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};

export default DesktopSidebar;
