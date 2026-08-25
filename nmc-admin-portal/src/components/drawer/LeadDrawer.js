import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { Textarea, Select } from '@windmill/react-ui';

import Title from '../form/Title';
import Error from '../form/Error';
import LabelArea from '../form/LabelArea';
import InputArea from '../form/InputArea';
import DrawerButton from '../form/DrawerButton';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Uploader from '../image-uploader/Uploader';
import { SidebarContext } from '../../context/SidebarContext';
import LeadServices from '../../services/LeadServices';
import { notifyError, notifySuccess } from '../../utils/toast';

const useLeadSubmit = (id) => {
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  const { closeDrawer, setIsUpdate } = useContext(SidebarContext);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  //RESET FORM 
  const { isDrawerOpen } = useContext(SidebarContext);

    useEffect(() => {
      if (!id && isDrawerOpen) {
        // Reset form fields
        setValue("product_title", "");
        setValue("product_name", "");
        setValue("product_sku", "");
        setValue("product_short_description", "");
        // setImageUrl("");
        // setUploadedFile(null);
        clearErrors();
      }
    }, [id, isDrawerOpen]);
  //RESET FORM 


  //GET VALUES
  useEffect(() => {
    if (!id) return;
  
    LeadServices.getBrandById(id)
      .then((res) => {
        // console.log("API RESPONSE:", res.data);

        const rows = res?.data;   
        if (!rows || rows.length === 0) {
          notifyError("Image not found!");
          return;
        }
        const brand = rows[0];
  
        setValue("product_title", brand.product_title || "");
        setImageUrl(brand.brand_logo || "");
        setUploadedFile(null);
      })
      .catch((err) => notifyError(err.message));
  }, [id]);
  
  //GET VALUES 


  // FORM SUBMISSION 
  const onSubmit = (data) => {

    // if (!uploadedFile && !id) {
    //   notifyError("Brand image is required!");
    //   return;
    // }
  
    const formData = new FormData();
    formData.append("product_title", data.product_title);
    formData.append("product_name", data.product_name);
    formData.append("product_sku", data.product_sku);
    formData.append("product_short_description", data.product_short_description);
  
    // if (uploadedFile) {
    //   formData.append("brand_logo", uploadedFile);
    // }
  
    if (id) {
      LeadServices.updateProduct(id, formData)
        .then((res) => {
          notifySuccess(res.message);
          setIsUpdate(true);
          closeDrawer();
        })
        .catch((err) => notifyError(err.message));
    } else {
      LeadServices.addProduct(formData)
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
  } = useLeadSubmit(id);

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            title="Update Product"
            description="Update your brand and related information here"
          />
        ) : (
          <Title
            title="Add Product"
            description="Add a new brand and its details here"
          />
        )}
      </div>

      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">

        <form onSubmit={handleSubmit(onSubmit)} className="block">
        <div className="px-6 pt-8 flex-grow w-full h-full max-h-full pb-40 md:pb-32 lg:pb-32 xl:pb-32">
          {/* Brand Image */}
          {/* <div className="grid grid-cols-6 gap-3 mb-6">
            <LabelArea label="Brand Image" />
            <div className="col-span-8 sm:col-span-4">
              <Uploader
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
                setUploadedFile={setUploadedFile}
              />
            </div>
          </div> */}

          {/* B */}
          <div className="grid grid-cols-6 gap-3 mb-6">
            <LabelArea label="Product Title" />
            <div className="col-span-8 sm:col-span-4">
              <InputArea
                register={register}
                required
                name="product_title"
                type="text"
                placeholder="Product Title"
              />
              <Error errorName={errors.product_title} />
            </div>
          </div>
          <div className="grid grid-cols-6 gap-3 mb-6">
            <LabelArea label="Product Name" />
            <div className="col-span-8 sm:col-span-4">
              <InputArea
                register={register}
                required
                name="product_name"
                type="text"
                placeholder="Product Name"
              />
              <Error errorName={errors.product_name} />
            </div>
          </div>
          <div className="grid grid-cols-6 gap-3 mb-6">
            <LabelArea label="Product SKU" />
            <div className="col-span-8 sm:col-span-4">
              <InputArea
                register={register}
                required
                name="product_sku"
                type="text"
                placeholder="Product SKU"
              />
              <Error errorName={errors.product_sku} />
            </div>
          </div>
          <div className="grid grid-cols-6 gap-3 mb-6">
            <LabelArea label="Product Description" />
            <div className="col-span-8 sm:col-span-4">
              <InputArea
                register={register}
                required
                name="product_short_description"
                type="text"
                placeholder="Product Description"
              />
              <Error errorName={errors.product_short_description} />
            </div>
          </div>

          <DrawerButton id={id} title="Product" />
        </div>
        </form>

      </Scrollbars>
    </>
  );

};

export default React.memo(BrandDrawer);
