import { useContext, useEffect, useState } from 'react';
import { SidebarContext } from '../context/SidebarContext';

const useToggleDrawer = () => {
  const [serviceId, setServiceId] = useState('');
  const { toggleDrawer, isDrawerOpen, toggleModal } =
    useContext(SidebarContext);
  const [drawerView, setDrawerView] = useState('USER'); // USER or PASSWORD

  const handleUpdate = (id) => {
    setServiceId(id);
    toggleDrawer();
    setDrawerView("USER");
  };

  const handleModalOpen = (id) => {
    setServiceId(id);
    toggleModal();
  };

  const handlePasswordDrawer = (id) => {
    setServiceId(id);
    setDrawerView("PASSWORD");
    toggleDrawer();
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      setServiceId();
      setDrawerView("USER");
    }
  }, [isDrawerOpen]);

  const handleOrderDrawer = (id) => {
    setServiceId(id);
    setDrawerView("ORDER");
    toggleDrawer();
  };

  return {
    serviceId,
    drawerView,
    handleModalOpen,
    handleUpdate,
    handlePasswordDrawer,
    handleOrderDrawer
  };
};

export default useToggleDrawer;
