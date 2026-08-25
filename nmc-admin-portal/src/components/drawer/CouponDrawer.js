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
import SelectOption from '../form/SelectOption';
import Uploader from '../image-uploader/Uploader';
import { SidebarContext } from '../../context/SidebarContext';
import CouponServices from '../../services/CouponServices';
import { notifyError, notifySuccess } from '../../utils/toast';

const useBrandSubmit = (id) => {
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
        setValue("coupon_code", "");
        setValue("discount_type", "");
        setValue("coupon_amount", ""); 
        setValue("start_date", "");
        setValue("end_date", "");
        // setImageUrl("");
        // setUploadedFile(null);
        clearErrors();
      }
    }, [id, isDrawerOpen]);
  //RESET FORM 


  //GET VALUES
  useEffect(() => {
    if (!id) return;
  
    CouponServices.getBrandById(id)
      .then((res) => {
        // console.log("API RESPONSE:", res.data);

        const rows = res?.data;   
        if (!rows || rows.length === 0) {
          notifyError("Brand not found!");
          return;
        }
        const brand = rows[0];
  
        setValue("coupon_code", brand.coupon_code || "");
        // setValue("discount_type", brand.discount_type || "");
        setValue("coupon_amount", brand.coupon_amount || "");
        setValue("start_date", formatForInput(brand.start_date));
setValue("end_date", formatForInput(brand.end_date));
        // setImageUrl(brand.brand_logo || "");
        // setUploadedFile(null);
      })
      .catch((err) => notifyError(err.message));
  }, [id]);
  
  const formatForInput = (dateString) => {
  if (!dateString) return "";

  const d = new Date(dateString);

  // Format → YYYY-MM-DDTHH:mm
  return d.toISOString().slice(0, 16);
};

  //GET VALUES 


  // // FORM SUBMISSION 
  // const onSubmit = (data) => {
  //   // if (!uploadedFile && !id) {
  //   //   notifyError("Brand image is required!");
  //   //   return;
  //   // }
  
  //   const formData = new FormData();
  //   formData.append("coupon_code", data.coupon_code);
  //   // formData.append("discount_type", data.discount_type);
  //   formData.append("coupon_amount", data.coupon_amount);
  //   formData.append("start_date", data.start_date);
  //   formData.append("end_date", data.end_date);
  
  //   // if (uploadedFile) {
  //   //   formData.append("brand_logo", uploadedFile);
  //   // }
  
  //   if (id) {
  //     CouponServices.updateBrand(id, formData)
  //       .then((res) => {
  //         notifySuccess(res.message);
  //         setIsUpdate(true);
  //         closeDrawer();
  //       })
  //       .catch((err) => notifyError(err.message));
  //   } else {
  //     CouponServices.addBrand(formData)
  //       .then((res) => {
  //         notifySuccess(res.message);
  //         setIsUpdate(true);
  //         closeDrawer();
  //       })
  //       .catch((err) => notifyError(err.message));
  //   }
  // };





 const onSubmit = (data) => {
  const payload = {
    coupon_code: data.coupon_code,
    coupon_amount: data.coupon_amount,
    start_date: data.start_date,
    end_date: data.end_date,
  };

  if (id) {
    CouponServices.updateBrand(id, payload)
      .then((res) => {
        notifySuccess(res.message);
        setIsUpdate(true);
        closeDrawer();
      })
      .catch((err) => notifyError(err.message));
  } else {
    CouponServices.addData(payload)
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
    // imageUrl,
    // setImageUrl,
    // uploadedFile,
    // setUploadedFile
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
    // uploadedFile,
    setUploadedFile
  } = useBrandSubmit(id);

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            title="Update Coupon"
            description="Update your Coupon and related information here"
          />
        ) : (
          <Title
            title="Add Coupon"
            description="Add a new Coupon and its details here"
          />
        )}
      </div>

      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">

        <form onSubmit={handleSubmit(onSubmit)} className="block">
        <div className="p-6 flex-grow scrollbar-hide w-full max-h-full pb-40">
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
          
          <div className="grid grid-cols-6 gap-3 mb-6">
            <LabelArea label="Coupon Code" />
            <div className="col-span-8 sm:col-span-4">
              <InputArea
                register={register}
                required
                name="coupon_code"
                type="text"
                placeholder="Coupon Code"
              />
              <Error errorName={errors.coupon_code} />
            </div>
          </div>
          <div className="grid grid-cols-6 gap-3 mb-6">
            <LabelArea label="Coupon Amount" />
            <div className="col-span-8 sm:col-span-4">
              <InputArea
                register={register}
                required
                name="coupon_amount"
                type="text"
                placeholder="Coupon Amount"
              />
              <Error errorName={errors.coupon_amount} />
            </div>
          </div>
           <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Coupon Validity Start Time" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Coupon validation Start Time"
                  name="start_date"
                  type="datetime-local"
                  placeholder="Coupon validation start time"
                />
                <Error errorName={errors.start_date} />
              </div>
            </div>
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Coupon Validity End Time" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Coupon validation End Time"
                  name="end_date"
                  type="datetime-local"
                  placeholder="Coupon validation End time"
                />
                <Error errorName={errors.end_date} />
              </div>
            </div>
           {/* <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Discount Type" />
              <div className="col-span-8 sm:col-span-4">
                <SelectOption
                  register={register}
                  label="Discount type"
                  name="discount_type"
                />
                <Error errorName={errors.discount_type} />
              </div>
            </div> */}

          <DrawerButton id={id} title="Coupon" />
          </div>


        </form>

      </Scrollbars>
    </>
  );

};

export default React.memo(BrandDrawer);
