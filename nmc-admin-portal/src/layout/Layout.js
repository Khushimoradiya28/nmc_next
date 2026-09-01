import React, { useContext, Suspense, useEffect, lazy } from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';

import Main from './Main';
import routes from '../routes';
import Header from '../components/header/Header';
import Sidebar from '../components/sidebar/Sidebar';
import { SidebarContext } from '../context/SidebarContext';
import { AdminContext } from '../context/AdminContext';
import ThemeSuspense from '../components/theme/ThemeSuspense';
import Cookies from 'js-cookie';

const Page404 = lazy(() => import('../pages/404'));

const Layout = () => {
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const { state } = useContext(AdminContext);
  let location = useLocation();

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

  useEffect(() => {
    closeSidebar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <div
      className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${
        isSidebarOpen && 'overflow-hidden'
      }`}
    >
      <Sidebar />

      <div className="flex flex-col flex-1 w-full">
        <Header />
        <Main>
          <Suspense fallback={<ThemeSuspense />}>
            <Switch>
              {routes.map((route, i) => {
                if (!route.component) return null;
                const isAllowed = !route.roles || route.roles.length === 0 || userRole === 'super_admin' || route.roles.map(r => r.toLowerCase().trim()).includes(userRole);

                return (
                  <Route
                    key={i}
                    exact={true}
                    path={`${route.path}`}
                    render={(props) =>
                      isAllowed ? (
                        <route.component {...props} />
                      ) : (
                        <Redirect to="/dashboard" />
                      )
                    }
                  />
                );
              })}
              <Redirect exact from="/" to="/dashboard" />
              <Route component={Page404} />
            </Switch>
          </Suspense>
        </Main>
      </div>
    </div>
  );
};

export default Layout;
