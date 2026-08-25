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
import Uploader from '../../image-uploader/Uploader';
import { SidebarContext } from '../../../context/SidebarContext';
import CategoryService from '../../../services/master/CategoryService';
import { notifyError, notifySuccess } from '../../../utils/toast';

const useBrandSubmit = (id) => {
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
        setValue("category_name", "");
        setImageUrl("");
        setUploadedFile(null);
        clearErrors();
      }
    }, [id, isDrawerOpen]);
  //RESET FORM 


  //GET VALUES
  useEffect(() => {
    if (!id) return;
  
    CategoryService.getBrandById(id)
      .then((res) => {
        // console.log("API RESPONSE:", res.data);

        const rows = res?.data;   
        if (!rows || rows.length === 0) {
          notifyError("Data not found!");
          return;
        }
        const brand = rows[0];
        reset({
            category_name: brand.category_name || "",
          });
        setImageUrl(brand.category_image || "");
        setUploadedFile(null);
      })
      .catch((err) => notifyError(err.message));
  }, [id]);
  
  //GET VALUES 


  // FORM SUBMISSION 
  const onSubmit = (data) => {
    
    if (!uploadedFile && !id) {
      notifyError("Brand image is required!");
      return;
    }
  
    const formData = new FormData();
    formData.append("category_name", data.category_name);
  
    if (uploadedFile) {
      formData.append("category_image", uploadedFile);
    }
  
    if (id) {
      CategoryService.updateBrand(id, formData)
        .then((res) => {
          notifySuccess(res.message);
          setIsUpdate(true);
          closeDrawer();
        })
        .catch((err) => notifyError(err.message));
    } else {
      CategoryService.addBrand(formData)
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
    imageUrl,
    setImageUrl,
    uploadedFile,
    setUploadedFile
  };
};


const BrandDrawer = ({ id }) => {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    imageUrl,
    setImageUrl,
    uploadedFile,
    setUploadedFile
  } = useBrandSubmit(id);

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            title="Update Category"
            description="Update your category and related information here"
          />
        ) : (
          <Title
            title="Add Category"
            description="Add a new category and its details here"
          />
        )}
      </div>

      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">

        <form onSubmit={handleSubmit(onSubmit)} className="block">
        <div className="px-6 pt-8 flex-grow w-full h-full max-h-full pb-40 md:pb-32 lg:pb-32 xl:pb-32">
          {/* Category Title */}
          <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
            <LabelArea label="Category Title" />
            <div className="col-span-8 sm:col-span-4">
              <InputArea
                register={register}
                required
                name="category_name"
                type="text"
                placeholder="Category Title"
              />
              <Error errorName={errors.category_name} />
            </div>
          </div>

          {/* Category Image */}
          <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
            <LabelArea label="Category Image" />
            <div className="col-span-8 sm:col-span-4 mt-3">
              <Uploader
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
                setUploadedFile={setUploadedFile}
              />
            </div>
          </div>
        </div>

          <DrawerButton id={id} title="Category" />

        </form>

      </Scrollbars>
    </>
  );

};

export default React.memo(BrandDrawer);
