import React, { useContext } from 'react';
import { NavLink, Route, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Button, WindmillContext } from '@windmill/react-ui';
import { IoLogOutOutline } from 'react-icons/io5';
import nmcLogo from '../../assets/img/logo/new-logo-1.png';

import sidebar from '../../routes/sidebar';
import SidebarSubmenu from './SidebarSubmenu';
import { AdminContext } from '../../context/AdminContext';

const SidebarContent = ({ isCollapsed }) => {
  const { mode } = useContext(WindmillContext);
  const { dispatch } = useContext(AdminContext);

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
        {sidebar.map((route) =>
          route.routes ? (
            <SidebarSubmenu route={route} key={route.name} isCollapsed={isCollapsed} />
          ) : (
            <li className="relative" key={route.name}>
              <NavLink
                exact
                to={route.path}
                className={`px-6 py-3.5 inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-red-800 dark:hover:text-amber-400 ${
                  isCollapsed ? 'justify-center' : ''
                }`}
                activeClassName="text-red-800 dark:text-amber-400 font-bold bg-red-50/70 dark:bg-gray-800"
              >
                <Route path={route.path} exact={route.exact}>
                  <span
                    className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-red-800 to-amber-500 rounded-tr-md rounded-br-md"
                    aria-hidden="true"
                  ></span>
                </Route>
                <route.icon className="w-5 h-5" aria-hidden="true" />
                <span
                  className={`ml-4 transition-all duration-300 ${
                    isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                  }`}
                >
                  {route.name}
                </span>
              </NavLink>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default SidebarContent;
