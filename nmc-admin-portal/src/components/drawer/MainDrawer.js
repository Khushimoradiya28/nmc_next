import React, { useContext } from 'react';
import Drawer from 'rc-drawer';
import { FiX } from 'react-icons/fi';
import { SidebarContext } from '../../context/SidebarContext';

const MainDrawer = ({ children, isDrawerOpen: customChildDrawerOpen, closeDrawer: customCloseDrawer, toggleDrawer: customToggleDrawer }) => {
  const { toggleDrawer, isDrawerOpen, closeDrawer } =
    useContext(SidebarContext);

  // Use custom props if provided, otherwise fallback to context
  const drawerOpen = customChildDrawerOpen !== undefined ? customChildDrawerOpen : isDrawerOpen;
  const handleClose = customCloseDrawer || closeDrawer;
  const handleToggle = customToggleDrawer || toggleDrawer;

  return (
    <Drawer
      open={drawerOpen}
      onClose={handleClose}
      parent={null}
      level={null}
      placement={'right'}
    >
      <button
        onClick={handleToggle}
        className="absolute focus:outline-none z-50 text-red-500 hover:bg-red-100 hover:text-gray-700 transition-colors duration-150 bg-white shadow-md mr-6 mt-6 right-0 left-auto w-10 h-10 rounded-full block text-center"
      >
        <FiX className="mx-auto" />
      </button>

      <div className="flex flex-col w-full h-full justify-between">
        {children}
      </div>
    </Drawer>
  );
};

export default React.memo(MainDrawer);
