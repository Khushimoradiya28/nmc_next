import React, { useContext } from "react";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import SidebarContent from "./SidebarContent";
import { SidebarContext } from "../../context/SidebarContext";

const DesktopSidebar = () => {
  const { isCollapsed, setIsCollapsed, isPinned, togglePinned } = useContext(SidebarContext);

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

  return (
    <aside
      className={`relative z-30 flex-shrink-0 hidden shadow-[4px_0_25px_-2px_rgba(0,0,0,0.08)] dark:shadow-[4px_0_25px_-2px_rgba(0,0,0,0.5)] border-r border-gray-100 dark:border-gray-800/80 overflow-y-auto no-scrollbar custom-scrollbar-none bg-white dark:bg-gray-800 lg:block transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'
        }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SidebarContent isCollapsed={isCollapsed} />

      {/* Toggle Pin Button - Outside on right edge */}
      <button
        onClick={togglePinned}
        className={`absolute bottom-6 -right-5 px-3 py-3 ml-5 transition-all duration-300 focus:outline-none shadow-lg hover:shadow-xl transform hover:scale-110 ${isPinned
          ? 'bg-red-800 text-white hover:bg-red-900 dark:bg-red-900 dark:hover:bg-red-950'
          : 'bg-gray-100 text-gray-600 hover:bg-red-800 hover:text-white dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-red-900 dark:hover:text-white'
          }`}
        title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
      >
        {isPinned ? (
          <FiChevronLeft className="w-4 h-4" />
        ) : (
          <FiChevronRight className="w-4 h-4" />
        )}
      </button>
    </aside>
  );
};

export default DesktopSidebar;
