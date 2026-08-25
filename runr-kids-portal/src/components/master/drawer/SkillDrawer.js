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
import SkillServices from '../../../services/master/SkillServices';
import { notifyError, notifySuccess } from '../../../utils/toast';

const useSkillSubmit = (id) => {
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
        setValue("skill_name", "");
        clearErrors();
      }
    }, [id, isDrawerOpen]);
  //RESET FORM 


  //GET VALUES
//   useEffect(() => {
//     if (!id) return;
  
//     SkillServices.getSkillById(id)
//       .then((res) => {
//         // console.log("API RESPONSE:", res.data);

//         const rows = res?.data;   
//         if (!rows || rows.length === 0) {
//           notifyError("Skill not found!");
//           return;
//         }
//         const skill = rows[0];
  
//         setValue("skill_name", skill.skill_name || "");
        
//       })
//       .catch((err) => notifyError(err.message));
//   }, [id]);
  
useEffect(() => {
  if (!id) return;

  SkillServices.getSkillById(id)
    .then((res) => {
      const rows = res?.data; // <-- array of skills

      if (!rows || rows.length === 0) {
        notifyError("Skill not found!");
        return;
      }

      const skill = rows[0]; 
       reset({
            skill_name: skill.skill_name || "",
          });   
      // setValue("skill_name", skill.skill_name || "");
    })
    .catch((err) => notifyError(err.message));
}, [id]);


  //GET VALUES 


// FORM SUBMISSION (body/raw)
const onSubmit = (data) => {
    const payload = {
      skill_name: data.skill_name,
    };
  
    if (id) {
      SkillServices.updateSkill(id, payload)
        .then((res) => {
          notifySuccess(res.message);
          setIsUpdate(true);
          closeDrawer();
        })
        .catch((err) => notifyError(err.message));
    } else {
      SkillServices.addSkill(payload)
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


const SkillDrawer = ({ id }) => {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
  } = useSkillSubmit(id);

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            title="Update Skill"
            description="Update your skill and related information here"
          />
        ) : (
          <Title
            title="Add Skill"
            description="Add a new skill and its details here"
          />
        )}
      </div>

      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">

        <form onSubmit={handleSubmit(onSubmit)} className="block">
        <div className="px-6 pt-8 flex-grow w-full h-full max-h-full pb-40 md:pb-32 lg:pb-32 xl:pb-32">
          {/* skill Title */}
          <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
            <LabelArea label="Skill Title" />
            <div className="col-span-8 sm:col-span-4">
              <InputArea
                register={register}
                required
                name="skill_name"
                type="text"
                placeholder="Skill Title"
              />
              <Error errorName={errors.skill_name} />
            </div>
          </div>
        </div>
          <DrawerButton id={id} title="Skill" />

        </form>

      </Scrollbars>
    </>
  );

};

export default React.memo(SkillDrawer);
