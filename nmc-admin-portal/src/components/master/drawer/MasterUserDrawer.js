import React, { useContext, useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Select from 'react-select';

import Title from '../../form/Title';
import Error from '../../form/Error';
import LabelArea from '../../form/LabelArea';
import DrawerButton from '../../form/DrawerButton';
import Uploader from '../../image-uploader/Uploader';
import { SidebarContext } from '../../../context/SidebarContext';
import MasterUserService from '../../../services/master/MasterUserService';
import AllUserRoles from '../../../services/master/UserRoleService';
import { notifyError, notifySuccess } from '../../../utils/toast';

// SingleSelect Component for Role Dropdown
const SingleSelect = ({
  options = [],
  value = null,
  onChange,
  labelKey = 'role_name',
  valueKey = '_id',
  placeholder = 'Select Role',
}) => {
  const formatted = options.map((item) => ({
    value: item[valueKey],
    label: item[labelKey] || item.name,
  }));

  const selectedOption = formatted.find((f) => f.value === value) || null;

  return (
    <Select
      options={formatted}
      isMulti={false}
      closeMenuOnSelect={true}
      value={selectedOption}
      onChange={(selected) => onChange(selected ? selected.value : null)}
      className="text-black text-sm"
      classNamePrefix="react-select"
      placeholder={placeholder}
    />
  );
};

const MasterUserDrawer = ({ id }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [roles, setRoles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const { closeDrawer, isDrawerOpen, setIsUpdate } = useContext(SidebarContext);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm();

  // Fetch Roles from Backend API
  useEffect(() => {
    let isMounted = true;
    AllUserRoles.getAllUserRoles()
      .then((res) => {
        if (isMounted) setRoles(res.data || []);
      })
      .catch((err) => notifyError(err.message));

    return () => {
      isMounted = false;
    };
  }, []);

  // Reset Form on Open for Add User
  useEffect(() => {
    if (!id && isDrawerOpen) {
      reset({
        first_name: '',
        last_name: '',
        email: '',
        mobile: '',
        password: '',
        role: null,
      });
      setImageUrl('');
      setUploadedFile(null);
      setShowPassword(false);
      clearErrors();
    }
  }, [id, isDrawerOpen, reset, clearErrors]);

  // Load User Data for Edit Mode
  useEffect(() => {
    if (!id) return;

    MasterUserService.getBrandById(id)
      .then((res) => {
        const masteruser = (res.data && res.data[0]) || res.data || {};
        reset({
          first_name: masteruser.first_name || '',
          last_name: masteruser.last_name || '',
          email: masteruser.email || '',
          mobile: masteruser.mobile || '',
          role: masteruser.role_id || masteruser.role?._id || masteruser.role || null,
          password: '',
        });
        setImageUrl(masteruser.profile_img_webp_url || masteruser.profile_img_url || masteruser.profile_img || '');
        setUploadedFile(null);
      })
      .catch((err) => notifyError(err.message));
  }, [id, reset]);

  // Form Submission Handler
  const onSubmit = (data) => {
    // 1. Strict Name Validation (Letters Only)
    if (!data.first_name || !/^[A-Za-z\s]+$/.test(data.first_name.trim())) {
      notifyError('First name must contain letters only!');
      return;
    }
    if (!data.last_name || !/^[A-Za-z\s]+$/.test(data.last_name.trim())) {
      notifyError('Last name must contain letters only!');
      return;
    }

    // 2. Strict Mobile Validation (10 Digits Only)
    if (!data.mobile || !/^\d{10}$/.test(data.mobile.trim())) {
      notifyError('Mobile number must be exactly 10 digits!');
      return;
    }

    // 3. Role Validation
    if (!data.role) {
      notifyError('Please select a user role!');
      return;
    }

    // 4. Password Validation (For Add User)
    if (!id && (!data.password || data.password.length < 6)) {
      notifyError('Password must be at least 6 characters long!');
      return;
    }

    const formData = new FormData();
    formData.append('first_name', data.first_name.trim());
    formData.append('last_name', data.last_name.trim());
    formData.append('email', data.email.trim());
    formData.append('mobile', data.mobile.trim());
    if (data.password) formData.append('password', data.password);
    formData.append('role_id', data.role || '');

    // Image is OPTIONAL
    if (uploadedFile) {
      formData.append('profile_img', uploadedFile);
    }

    if (id) {
      MasterUserService.updateBrand(id, formData)
        .then((res) => {
          notifySuccess(res.message || 'User updated successfully!');
          setIsUpdate(true);
          closeDrawer();
        })
        .catch((err) => notifyError(err?.response?.data?.message || err.message));
    } else {
      MasterUserService.addBrand(formData)
        .then((res) => {
          notifySuccess(res.message || 'User created successfully!');
          setIsUpdate(true);
          closeDrawer();
        })
        .catch((err) => notifyError(err?.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title title="Update User" description="Update user and related information here" />
        ) : (
          <Title title="Add User" description="Add a new User and its details here" />
        )}
      </div>

      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="block">
          <div className="px-6 pt-8 flex-grow w-full h-full max-h-full pb-40 md:pb-32 lg:pb-32 xl:pb-32">
            {/* First Name (Strict Letters Only) */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="First Name" />
              <div className="col-span-8 sm:col-span-4">
                <input
                  {...register('first_name', {
                    required: 'First name is required',
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: 'First name must contain letters only',
                    },
                  })}
                  type="text"
                  placeholder="First Name"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '');
                  }}
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white dark:text-gray-200 rounded-md px-4"
                />
                <Error errorName={errors.first_name} />
              </div>
            </div>

            {/* Last Name (Strict Letters Only) */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Last Name" />
              <div className="col-span-8 sm:col-span-4">
                <input
                  {...register('last_name', {
                    required: 'Last name is required',
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: 'Last name must contain letters only',
                    },
                  })}
                  type="text"
                  placeholder="Last Name"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '');
                  }}
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white dark:text-gray-200 rounded-md px-4"
                />
                <Error errorName={errors.last_name} />
              </div>
            </div>

            {/* Email */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Email" />
              <div className="col-span-8 sm:col-span-4">
                <input
                  {...register('email', {
                    required: 'Email is required',
                  })}
                  type="email"
                  placeholder="Email"
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white dark:text-gray-200 rounded-md px-4"
                />
                <Error errorName={errors.email} />
              </div>
            </div>

            {/* Mobile (Strict 10 Digits Only) */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Mobile" />
              <div className="col-span-8 sm:col-span-4">
                <input
                  {...register('mobile', {
                    required: 'Mobile is required',
                    pattern: {
                      value: /^\d{10}$/,
                      message: 'Mobile number must be exactly 10 digits',
                    },
                  })}
                  maxLength={10}
                  type="tel"
                  placeholder="10-digit Mobile Number"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  }}
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white dark:text-gray-200 rounded-md px-4"
                />
                <Error errorName={errors.mobile} />
              </div>
            </div>

            {/* Role Dropdown */}
            <div className="grid grid-cols-6 gap-6 mb-6">
              <LabelArea label="Role" />
              <div className="col-span-4 mt-2">
                <SingleSelect
                  options={roles}
                  value={watch('role') || null}
                  onChange={(val) => setValue('role', val, { shouldValidate: true })}
                  labelKey="role_name"
                  valueKey="_id"
                  placeholder="Select Role"
                />
              </div>
            </div>

            {/* Password with Eye Toggle (Show for Add User) */}
            {!id && (
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Password" />
                <div className="col-span-8 sm:col-span-4 relative">
                  <input
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white dark:text-gray-200 rounded-md pl-4 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none p-1 cursor-pointer"
                    title={showPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                  <Error errorName={errors.password} />
                </div>
              </div>
            )}

            {/* Optional User Image */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="User Image (Optional)" />
              <div className="col-span-8 sm:col-span-4 mt-3">
                <Uploader
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                  setUploadedFile={setUploadedFile}
                />
              </div>
            </div>

            <DrawerButton id={id} title="User" />
          </div>
        </form>
      </Scrollbars>
    </>
  );
};

export default React.memo(MasterUserDrawer);
