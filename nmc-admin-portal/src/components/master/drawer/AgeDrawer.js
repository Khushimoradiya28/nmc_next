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
import AgeServices from '../../../services/master/AgeService';
import { notifyError, notifySuccess } from '../../../utils/toast';

const useAgeSubmit = (id) => {
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

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
        // Reset form fields
        setValue("age_group", "");
        setValue("age_label", "");
        clearErrors();
      }
    }, [id, isDrawerOpen]);
  //RESET FORM 


  //GET VALUES
  useEffect(() => {
    if (!id) return;
  
    AgeServices.getAgeById(id)
      .then((res) => {
        // console.log("API RESPONSE:", res.data);

        const rows = res?.data;   
        if (!rows || rows.length === 0) {
          notifyError("Age not found!");
          return;
        }
        const age = rows[0];
        reset({
            age_group: age.age_group || "",
            age_label: age.age_label || "",
          });        
      })
      .catch((err) => notifyError(err.message));
  }, [id]);
  
  //GET VALUES 


// FORM SUBMISSION (body/raw)
const onSubmit = (data) => {
    const payload = {
      age_group: data.age_group,
      age_label: data.age_label,
    };
  
    if (id) {
      AgeServices.updateAge(id, payload)
        .then((res) => {
          notifySuccess(res.message);
          setIsUpdate(true);
          closeDrawer();
        })
        .catch((err) => notifyError(err.message));
    } else {
      AgeServices.addAge(payload)
        .then((res) => {
          notifySuccess(res.message);
          setIsUpdate(true);
          closeDrawer();
        })
        .catch((err) => notifyError(err.message));
    }
  };
  
  // FORM SUBMISSION 


  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
  };
};


const AgeDrawer = ({ id }) => {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
  } = useAgeSubmit(id);

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            title="Update Age Group"
            description="Update your age group and related information here"
          />
        ) : (
          <Title
            title="Add Age Group"
            description="Add a new age group and its details here"
          />
        )}
      </div>

      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">

        <form onSubmit={handleSubmit(onSubmit)} className="block">
        <div className="px-6 pt-8 flex-grow w-full h-full max-h-full pb-40 md:pb-32 lg:pb-32 xl:pb-32">
          {/* Age Title */}
          <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
            <LabelArea label="Age Group Title" />
            <div className="col-span-8 sm:col-span-4">
              <InputArea
                register={register}
                required
                name="age_group"
                type="text"
                placeholder="Age Group Title"
              />
              <Error errorName={errors.age_group} />
            </div>
            <LabelArea label="Age Label" />
            <div className="col-span-8 sm:col-span-4">
              <InputArea
                register={register}
                required
                name="age_label"
                type="text"
                placeholder="Age Label"
              />
              <Error errorName={errors.age_label} />
            </div>
          </div>
        </div>
          <DrawerButton id={id} title="Age" />

        </form>

      </Scrollbars>
    </>
  );

};

export default React.memo(AgeDrawer);
