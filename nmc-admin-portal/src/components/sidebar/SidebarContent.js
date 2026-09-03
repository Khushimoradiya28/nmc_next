import React, { useContext } from 'react';
import { NavLink, Route, Link, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Button, WindmillContext } from '@windmill/react-ui';
import { IoLogOutOutline } from 'react-icons/io5';
import nmcLogo from '../../assets/img/logo/new-logo-1.png';

import sidebar from '../../routes/sidebar';
import SidebarSubmenu from './SidebarSubmenu';
import { AdminContext } from '../../context/AdminContext';

const SidebarContent = ({ isCollapsed }) => {
  const { mode } = useContext(WindmillContext);
  const { state, dispatch } = useContext(AdminContext);
  const location = useLocation();

  // Safely extract role from context or cookies
  const adminInfo = state?.adminInfo || (Cookies.get("adminInfo") ? JSON.parse(Cookies.get("adminInfo")) : null);
  
  const rawRole = (
    adminInfo?.role_name ||
    (typeof adminInfo?.role === 'object' ? adminInfo?.role?.role_name : '') ||
    (typeof adminInfo?.role === 'string' ? adminInfo?.role : '') ||
    ''
  ).toLowerCase().trim();

  const userRole = (rawRole === 'admin' || rawRole === 'super_admin' || rawRole === 'superadmin')
    ? 'super_admin'
    : rawRole;

  // Filter sidebar based on permitted roles
  const filteredSidebar = sidebar.filter((route) => {
    if (!route.roles || route.roles.length === 0) return true;
    if (userRole === 'super_admin') return true;
    return route.roles.map((r) => r.toLowerCase().trim()).includes(userRole);
  });

  const isRouteActive = (routePath) => {
    const currentPath = location.pathname;
    const currentSearch = location.search;

    const [targetPath, targetSearch] = routePath.split('?');

    // 1. If target has query parameters (e.g. /products?type=testimonial)
    if (targetSearch) {
      if (currentPath !== targetPath) return false;
      return currentSearch === `?${targetSearch}` || currentSearch.includes(targetSearch);
    }

    // 2. Dashboard matches both /dashboard and /
    if (targetPath === '/dashboard') {
      return currentPath === '/dashboard' || currentPath === '/';
    }

    // 3. Exact match
    if (currentPath === targetPath) {
      return true;
    }

    // 4. Special handling for /master:
    // Only active for sub-routes of /master that do NOT have their own dedicated sidebar item
    if (targetPath === '/master') {
      if (!currentPath.startsWith('/master')) return false;
      if (
        currentPath.startsWith('/master/user') ||
        currentPath.startsWith('/master/faculty') ||
        currentPath.startsWith('/master/academic-programs')
      ) {
        return false;
      }
      return true;
    }

    // 5. For other routes, active if current path starts with target path + '/'
    if (currentPath.startsWith(`${targetPath}/`)) {
      return true;
    }

    return false;
  };

  return (
    <div className="py-4 text-gray-500 dark:text-gray-400">
      <Link className="text-gray-900 dark:text-gray-200 block px-4 mb-3" to="/dashboard">
        <div className="flex items-center justify-center gap-2">
          <img
            src={nmcLogo}
            alt="NMC Logo"
            className={`transition-all duration-300 object-contain ${
              isCollapsed ? 'h-9 w-9 opacity-90' : 'h-12 max-w-[170px] opacity-100'
            }`}
          />
        </div>
      </Link>

      <ul className="mt-6">
        {filteredSidebar.map((route) => {
          if (route.routes) {
            return <SidebarSubmenu route={route} key={route.name} isCollapsed={isCollapsed} />;
          }

          const isActive = isRouteActive(route.path);

          return (
            <li className="relative" key={route.name}>
              <NavLink
                to={route.path}
                isActive={() => isActive}
                className={`px-6 py-3.5 inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 ${
                  isActive
                    ? 'text-red-800 dark:text-amber-400 font-bold bg-red-50/70 dark:bg-gray-800'
                    : 'text-gray-500 dark:text-gray-400 hover:text-red-800 dark:hover:text-amber-400'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                {isActive && (
                  <span
                    className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-red-800 to-amber-500 rounded-tr-md rounded-br-md"
                    aria-hidden="true"
                  ></span>
                )}
                {route.icon && (
                  <route.icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      isActive ? 'text-red-800 dark:text-amber-400' : ''
                    }`}
                    aria-hidden="true"
                  />
                )}
                <span
                  className={`ml-4 transition-all duration-300 ${
                    isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                  }`}
                >
                  {route.name}
                </span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SidebarContent;
