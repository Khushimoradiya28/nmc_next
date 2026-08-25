import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { Textarea, Select } from '@windmill/react-ui';

import Title from '../../form/Title';
import Error from '../../form/Error';
import LabelArea from '../../form/LabelArea';
import InputArea from '../../form/InputArea';
import DrawerButton from '../../form/DrawerButton';
// import useProductSubmit from '../../../hooks/useProductSubmit';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Uploader from '../../image-uploader/Uploader';
import { SidebarContext } from '../../../context/SidebarContext';
import BrandServices from '../../../services/master/UsersServices';
import { notifyError, notifySuccess } from '../../../utils/toast';

const useBrandSubmit = (id) => {
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState("");

  const { closeDrawer, isDrawerOpen, setIsUpdate } = useContext(SidebarContext);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // if (!uploadedFileName) {
    //   notifyError('Brand image is required!');
    //   return;
    // }

    const body = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      mobile: data.mobile,
      password: data.password,
      // brand_logo: uploadedFileName,
    };

    if (id) {
      BrandServices.updateBrand(id, body)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
          closeDrawer();
        })
        .catch((err) => notifyError(err.message));
    } else {
      BrandServices.addBrand(body)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
          closeDrawer();
        })
        .catch((err) => notifyError(err.message));
    }
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      setValue('first_name', '');
      setValue('last_name', '');
      setValue('email', '');
      setValue('mobile', '');
      setValue('password', '');
      setImageUrl('');
      clearErrors('first_name');
      return;
    }

    if (id) {
      BrandServices.getBrandById(id)
        .then((res) => {
          setValue('first_name', res.first_name);
          setImageUrl(res.brand_logo);
        })
        .catch(() => notifyError('Server error!'));
    }
  }, [id, isDrawerOpen, setValue]);

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    imageUrl,
    setImageUrl,
    uploadedFileName,
    setUploadedFileName,
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
    uploadedFileName,
    setUploadedFileName,
  } = useBrandSubmit(id);

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            title="Update User"
            description="Updated your User and necessary information from here"
          />
        ) : (
          <Title
            title="Add User"
            description="Add your User and necessary information from here"
          />
        )}
      </div>
      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
      <form onSubmit={handleSubmit(onSubmit)} className="block">

        <div className="grid grid-cols-6 gap-3 mb-6">
          <LabelArea label="User Image" />
          <div className="col-span-8 sm:col-span-4">
          <Uploader
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            setUploadedFileName={setUploadedFileName}
          />

            {/* <Uploader imageUrl={imageUrl} setImageUrl={setImageUrl} /> */}
          </div>
        </div>

        <div className="grid grid-cols-6 gap-3 mb-6">
          <LabelArea label="Frist Name" />
          <div className="col-span-8 sm:col-span-4">
            <InputArea
              register={register}
              required="true"
              name="first_name"
              type="text"
              placeholder="First Name"
            />
            <Error errorName={errors.first_name} />
          </div>
        </div>

        <div className="grid grid-cols-6 gap-3 mb-6">
          <LabelArea label="Last Name" />
          <div className="col-span-8 sm:col-span-4">
            <InputArea
              register={register}
              required="true"
              name="last_name"
              type="text"
              placeholder="Last Name"
            />
            <Error errorName={errors.last_name} />
          </div>
        </div>

        <div className="grid grid-cols-6 gap-3 mb-6">
          <LabelArea label="Email" />
          <div className="col-span-8 sm:col-span-4">
            <InputArea
              register={register}
              required="true"
              name="email"
              type="text"
              placeholder="Email"
            />
            <Error errorName={errors.email} />
          </div>
        </div>
       
        <div className="grid grid-cols-6 gap-3 mb-6">
          <LabelArea label="Mobile No." />
          <div className="col-span-8 sm:col-span-4">
            <InputArea
              register={register}
              required="true"
              name="mobile"
              type="text"
              placeholder="Mobile Number"
            />
            <Error errorName={errors.mobile} />
          </div>
        </div>

         <div className="grid grid-cols-6 gap-3 mb-6">
          <LabelArea label="Password" />
          <div className="col-span-8 sm:col-span-4">
            <InputArea
              register={register}
              required="true"
              name="password"
              type="password"
              placeholder="password"
            />
            <Error errorName={errors.password} />
          </div>
        </div>

        <DrawerButton id={id} title="User" />

      </form>

      </Scrollbars>
    </>
  );
};

export default React.memo(BrandDrawer);
