import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';

const SidebarSubmenu = ({ route, isCollapsed }) => {
  const location = useLocation();

  // Check if current route matches any of the submenu paths
  const isSubmenuActive = route.routes.some((subRoute) => {
    const [subPath, subSearch] = subRoute.path.split('?');
    if (location.pathname !== subPath) return false;
    if (!subSearch) return true;
    return location.search === `?${subSearch}`;
  });

  const [isOpen, setIsOpen] = useState(isSubmenuActive);

  useEffect(() => {
    if (isSubmenuActive) {
      setIsOpen(true);
    }
  }, [location.pathname, location.search, isSubmenuActive]);

  function handleToggle(e) {
    e.preventDefault();
    setIsOpen(!isOpen);
  }

  return (
    <li className="relative flex flex-col" key={route.name}>
      <button
        className={`px-6 py-3.5 inline-flex items-center justify-between w-full text-sm font-semibold transition-colors duration-150 hover:text-red-800 dark:hover:text-amber-400 focus:outline-none ${
          isSubmenuActive ? 'text-red-800 dark:text-amber-400 font-bold bg-red-50/50 dark:bg-gray-800/60' : ''
        } ${isCollapsed ? 'justify-center' : ''}`}
        onClick={handleToggle}
      >
        <div className="inline-flex items-center">
          {isSubmenuActive && (
            <span
              className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-red-800 to-amber-500 rounded-tr-md rounded-br-md"
              aria-hidden="true"
            ></span>
          )}
          <route.icon className="w-5 h-5" aria-hidden="true" />
          <span
            className={`ml-4 transition-all duration-300 ${
              isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
            }`}
          >
            {route.name}
          </span>
        </div>
        {!isCollapsed && (
          <span className="ml-2">
            {isOpen ? (
              <FiChevronDown className="w-4 h-4 text-red-800 dark:text-amber-400" />
            ) : (
              <FiChevronRight className="w-4 h-4" />
            )}
          </span>
        )}
      </button>

      {isOpen && !isCollapsed && (
        <ul
          className="py-1.5 pl-10 pr-3 overflow-hidden text-sm font-medium text-gray-600 dark:text-gray-400 space-y-1 my-1"
          aria-label="submenu"
        >
          {route.routes.map((subRoute) => {
            const [subPath, subSearch] = subRoute.path.split('?');
            const isActive =
              location.pathname === subPath &&
              (!subSearch || location.search === `?${subSearch}`);

            return (
              <li key={subRoute.name}>
                <NavLink
                  to={subRoute.path}
                  className={`w-full inline-block py-2 px-3 text-sm font-semibold rounded-lg transition-colors duration-150 ${
                    isActive
                      ? 'text-red-800 dark:text-amber-400 font-bold bg-red-100/70 dark:bg-gray-800 shadow-xs'
                      : 'hover:text-red-800 dark:hover:text-amber-400 hover:bg-red-50/70 dark:hover:bg-gray-800/40'
                  }`}
                >
                  • {subRoute.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
};

export default SidebarSubmenu;
