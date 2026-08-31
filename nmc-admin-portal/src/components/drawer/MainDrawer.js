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
        className="absolute focus:outline-none z-50 bg-red-700 hover:bg-red-800 text-white shadow-md mr-6 mt-6 right-0 left-auto w-9 h-9 rounded-md flex items-center justify-center transition-colors duration-150"
        title="Close"
      >
        <FiX className="w-5 h-5 text-white" />
      </button>

      <div className="flex flex-col w-full h-full justify-between">
        {children}
      </div>
    </Drawer>
  );
};

export default React.memo(MainDrawer);
