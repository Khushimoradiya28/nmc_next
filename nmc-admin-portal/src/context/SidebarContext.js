import React, { useState, createContext } from 'react';

// create context
export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isfilterDrawerOpen, setfilterIsDrawerOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPinned, setIsPinned] = useState(true);
  const [isleadfilterDrawerOpen, setleadfilterDrawerOpen] = useState(false);
  const [isordersfilterDrawerOpen, setordersfilterDrawerOpen] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  const closefilterDrawer = () => setfilterIsDrawerOpen(false);
  const filtertoggleDrawer = () => setfilterIsDrawerOpen(!isfilterDrawerOpen);

  const closeModal = () => setIsModalOpen(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  // LEAD  
  const closeleadfilterDrawer = () => setleadfilterDrawerOpen(false);
  const leadfiltertoggleDrawer = () => setleadfilterDrawerOpen(!isleadfilterDrawerOpen);

  // ORDERS  
  const closeordersfilterDrawer = () => setordersfilterDrawerOpen(false);
  const ordersfiltertoggleDrawer = () => setordersfilterDrawerOpen(!isordersfilterDrawerOpen);

  const togglePinned = () => setIsPinned(!isPinned);

  // const value = useMemo(
  //   () => ({
  //     isSidebarOpen,
  //     toggleSidebar,
  //     closeSidebar,
  //     isDrawerOpen,
  //     toggleDrawer,
  //     closeDrawer,
  //     setIsDrawerOpen,
  //     isModalOpen,
  //     toggleModal,
  //     closeModal,
  //     isUpdate,
  //     setIsUpdate,
  //   }),

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [isSidebarOpen, isDrawerOpen, isModalOpen, isUpdate]
  // );

  return (
    <SidebarContext.Provider
      value={{
        isSidebarOpen,
        toggleSidebar,
        closeSidebar,
        isDrawerOpen,
        toggleDrawer,
        closeDrawer,
        setIsDrawerOpen,
        isModalOpen,
        toggleModal,
        closeModal,
        isUpdate,
        setIsUpdate,
        closefilterDrawer,
        filtertoggleDrawer,
        isfilterDrawerOpen,
        isCollapsed,
        setIsCollapsed,
        isPinned,
        setIsPinned,
        togglePinned,
        closeleadfilterDrawer,
        leadfiltertoggleDrawer,
        isleadfilterDrawerOpen,
        closeordersfilterDrawer,
        ordersfiltertoggleDrawer,
        isordersfilterDrawerOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
