import React, { useContext } from "react";
import { Button } from "@windmill/react-ui";
import { SidebarContext } from "../../context/SidebarContext";

const DrawerButton = ({id, title}) => {
  const { toggleDrawer } = useContext(SidebarContext);
  return (
    <>
      <div className="fixed bottom-0 w-full right-0 py-4 lg:py-8 px-6 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex bg-gray-50 border-t border-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">        
        <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
          <Button type="submit" className="w-full h-12">
            {" "}
            {id ? <span>Update {title}</span> : <span>Add {title}</span>}
          </Button>
        </div>
      </div>
    </>
  );
};

export default DrawerButton;
