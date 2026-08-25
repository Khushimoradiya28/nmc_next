import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { Textarea, Select } from '@windmill/react-ui';

import Title from '../../form/Title';
import Error from '../../form/Error';
import LabelArea from '../../form/LabelArea';
import InputArea from '../../form/InputArea'; // Still needed for color_name
import DrawerButton from '../../form/DrawerButton';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { SidebarContext } from '../../../context/SidebarContext';
import ColorService from '../../../services/master/ColorService';
import { notifyError, notifySuccess } from '../../../utils/toast';

// useRoleSubmit remains the same
const useRoleSubmit = (id) => {
    
  const { closeDrawer, setIsUpdate } = useContext(SidebarContext);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    watch, // Add watch to get the current value of color_code
    formState: { errors },
  } = useForm();

  // Get the current color code value to display the selected color
  const colorCodeWatch = watch('color_code'); 

  //RESET FORM 
  const { isDrawerOpen } = useContext(SidebarContext);

    useEffect(() => {
      if (!id && isDrawerOpen) {       
        setValue("color_name", ""); 
        setValue("color_code", "#000000"); // Initialize color code with black
        clearErrors();
      }
    }, [id, isDrawerOpen, setValue, clearErrors, isDrawerOpen]); // Added dependencies
  //RESET FORM 


  //GET VALUES
  useEffect(() => {
    if (!id) return;
  
    ColorService.getBrandById(id)
      .then((res) => {
        
        const rows = res?.data;   
        if (!rows || rows.length === 0) {
          notifyError("Data not found!");
          return;
        }
        const role = rows[0];  
        reset({
        color_name: role.color_name || "",
        color_code: role.color_code || "#000000", // Ensure a default value if missing
      });               
      })
      .catch((err) => notifyError(err.message));
  }, [id, reset]); // Added dependency reset
  

  const onSubmit = (data) => {
  const payload = {
    color_name: data.color_name,
     color_code: data.color_code,
  };

  if (id) {
    ColorService.updateBrand(id, payload)
      .then((res) => {
        notifySuccess(res.message);
        setIsUpdate(true);
        closeDrawer();
      })
      .catch((err) => notifyError(err.message));
  } else {
    ColorService.addData(payload)
      .then((res) => {
        notifySuccess(res.message);
        setIsUpdate(true);
        closeDrawer();
      })
      .catch((err) => notifyError(err.message));
  }
};
  
  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    colorCodeWatch, // Return the watched value
    setValue // Return setValue for manual updates if needed
  };
};


const DataDrawer = ({ id }) => {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    colorCodeWatch, // Get the watched color code
    setValue // Get setValue function
  } = useRoleSubmit(id);

  // Function to handle changes from the custom color input
  const handleColorChange = (e) => {
    // Manually update the 'color_code' field value in react-hook-form
    setValue('color_code', e.target.value, { shouldValidate: true });
  };


  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            title="Update Color"
            description="Update your Color and related information here"
          />
        ) : (
          <Title
            title="Add Color"
            description="Add a new Color and its details here"
          />
        )}
      </div>

      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">

        <form onSubmit={handleSubmit(onSubmit)} className="block">
      <div className="px-6 pt-8 flex-grow w-full h-full max-h-full pb-40 md:pb-32 lg:pb-32 xl:pb-32">
                    
          <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
            <LabelArea label="Color Name" /> {/* Changed 'Color' to 'Color Name' for clarity */}
            <div className="col-span-8 sm:col-span-4">
              <InputArea
                register={register}
                required
                name="color_name"
                type="text"
                placeholder="Color Name"
              />
              <Error errorName={errors.color_name} />
            </div>
          </div>

          {/* MODIFIED: Color Code Input with Color Picker */}
          <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
            <LabelArea label="Color Code" />
            <div className="col-span-8 sm:col-span-4 flex space-x-3 items-start">
              
              {/* 1. Color Picker Input (The Actual Select Box) */}
              <input
            type="color"
            name="color_picker"
            value={colorCodeWatch || '#000000'} // Use the watched value
            onChange={handleColorChange}
            className="w-12 h-10 p-1 border border-gray-300 rounded cursor-pointer dark:bg-gray-800 mt-4"
            title="Select Color"
        />

              {/* 2. Text Input for Hex Code (Read-Only/Manual Entry Option) */}
              <InputArea
                register={register}
                required
                name="color_code"
                type="text"
                value={colorCodeWatch || '#000000'} // Use the watched value
                onChange={(e) => setValue('color_code', e.target.value)} // Allows manual input as well
                placeholder="#RRGGBB Code"
                className="flex-grow" // Take up remaining space
              />
              
              <Error errorName={errors.color_code} />
            </div>
          </div>
          {/* END MODIFIED */}

          <DrawerButton id={id} title="Color" />
      </div>
        </form>

      </Scrollbars>
    </>
  );

};

export default React.memo(DataDrawer);