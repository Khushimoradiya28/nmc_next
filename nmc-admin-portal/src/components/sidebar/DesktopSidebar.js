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
      className={`relative z-30 flex-shrink-0 hidden shadow-sm overflow-y-auto bg-white dark:bg-gray-800 lg:block transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'
        }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SidebarContent isCollapsed={isCollapsed} />

      {/* Toggle Pin Button - Outside on right edge */}
      <button
        onClick={togglePinned}
        className={`absolute bottom-6 -right-5 px-3 py-3 ml-5 transition-all duration-300 focus:outline-none shadow-lg hover:shadow-xl transform hover:scale-110 ${isPinned
          ? 'bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'
          : 'bg-gray-100 text-gray-600 hover:bg-green-500 hover:text-white dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-green-600 dark:hover:text-white'
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
