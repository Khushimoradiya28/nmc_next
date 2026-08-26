import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { Textarea, Select } from '@windmill/react-ui';

import Title from '../../form/Title';
import Error from '../../form/Error';
import LabelArea from '../../form/LabelArea';
import InputArea from '../../form/InputArea';
import DrawerButton from '../../form/DrawerButton';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { SidebarContext } from '../../../context/SidebarContext';
import CommodityService from '../../../services/master/CommodityService';
import { notifyError, notifySuccess } from '../../../utils/toast';

const useRoleSubmit = (id) => {
    

  const { closeDrawer, setIsUpdate } = useContext(SidebarContext);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm();

  //RESET FORM 
  const { isDrawerOpen } = useContext(SidebarContext);

    useEffect(() => {
      if (!id && isDrawerOpen) {       
        setValue("commodity_name", "");                
        setValue("_id", "");
        clearErrors();
      }
    }, [id, isDrawerOpen]);
  //RESET FORM 


  //GET VALUES
  useEffect(() => {
    if (!id) return;
  
    CommodityService.getBrandById(id)
      .then((res) => {
        
        const rows = res?.data;   
        if (!rows || rows.length === 0) {
          notifyError("Data not found!");
          return;
        }
        const role = rows[0];  
        reset({
        commodity_name: role.commodity_name || "",
      });
      })
      .catch((err) => notifyError(err.message));
  }, [id]);
  

  const onSubmit = (data) => {
  const payload = {
    commodity_name: data.commodity_name,
  };

  if (id) {
    CommodityService.updateBrand(id, payload)
      .then((res) => {
        notifySuccess(res.message);
        setIsUpdate(true);
        closeDrawer();
      })
      .catch((err) => notifyError(err.message));
  } else {
    CommodityService.addData(payload)
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
  };
};


const DataDrawer = ({ id }) => {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,       
  } = useRoleSubmit(id);

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            title="Update Commodity"
            description="Update your Commodity and related information here"
          />
        ) : (
          <Title
            title="Add Commodity"
            description="Add a new Commodity and its details here"
          />
        )}
      </div>

      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">

        <form onSubmit={handleSubmit(onSubmit)} className="block">
      <div className="px-6 pt-8 flex-grow w-full h-full max-h-full pb-40 md:pb-32 lg:pb-32 xl:pb-32">
          
          {/*  Role */}
          <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
            <LabelArea label="Commodity" />
            <div className="col-span-8 sm:col-span-4">
              <InputArea
                register={register}
                required
                name="commodity_name"
                type="text"
                placeholder="Commodity"
              />
              <Error errorName={errors.commodity_name} />
            </div>
          </div>

          <DrawerButton id={id} title="Commodity" />
      </div>
        </form>

      </Scrollbars>
    </>
  );

};

export default React.memo(DataDrawer);
