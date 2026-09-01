import React, { useContext, useState, useEffect } from 'react';
import { Button, Label } from '@windmill/react-ui';
import { FiCamera, FiUser, FiMail, FiPhone, FiShield } from 'react-icons/fi';
import Select from 'react-select';

import Error from '../components/form/Error';
import useProfileSubmit from '../hooks/useProfileSubmit';
import { AdminContext } from '../context/AdminContext';
import PageTitle from '../components/Typography/PageTitle';
import LetterAvatar from '../components/common/LetterAvatar';

// Dynamic Profile Avatar Uploader Component with Letter Avatar Fallback
const AvatarUploader = ({ imageUrl, setImageUrl, setUploadedFile, name = '' }) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [imageUrl]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (setUploadedFile) {
      setUploadedFile(file);
    }
    setImgError(false);
    setImageUrl(URL.createObjectURL(file));
  };

  let resolvedSrc = imageUrl;
  if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('blob:')) {
    const backendBase = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
    resolvedSrc = `${backendBase}/${imageUrl.replace(/^\//, '')}`;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
      {/* Circle Avatar with Camera Badge */}
      <label
        htmlFor="profile_avatar_upload"
        className="relative group flex-shrink-0 cursor-pointer"
        title="Click to upload profile photo"
      >
        {resolvedSrc && !imgError ? (
          <img
            src={resolvedSrc}
            alt="Profile Preview"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-xl ring-4 ring-red-900/10 bg-white dark:bg-gray-700 transition group-hover:opacity-90"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-xl ring-4 ring-red-900/10 flex items-center justify-center bg-red-700 text-white text-3xl font-bold">
            <LetterAvatar name={name || 'Admin'} size={110} />
          </div>
        )}
        <div className="absolute bottom-1 right-1 bg-red-800 group-hover:bg-red-900 text-white p-2.5 rounded-full shadow-lg transition-all transform group-hover:scale-110 z-10">
          <FiCamera className="w-4 h-4" />
        </div>
        <input
          id="profile_avatar_upload"
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
      </label>
    </div>
  );
};

// SingleSelect Component for Roles
const SingleSelect = ({ options = [], value = null, onChange, placeholder = 'Select Role' }) => {
  const formatted = options.map((item) => ({
    value: item._id,
    label: item.role_name || item.name,
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
      styles={{
        control: (base, state) => ({
          ...base,
          minHeight: '48px',
          borderRadius: '0.375rem',
          borderColor: state.isFocused ? '#991b1b' : '#e5e7eb',
          boxShadow: state.isFocused ? '0 0 0 1px #991b1b' : 'none',
          backgroundColor: '#f9fafb',
          '&:hover': {
            borderColor: '#991b1b',
          },
        }),
      }}
    />
  );
};

const EditProfile = () => {
  const {
    state: { adminInfo },
  } = useContext(AdminContext);

  const adminId = adminInfo?._id || adminInfo?.id;

  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    imageUrl,
    setImageUrl,
    uploadedFile,
    setUploadedFile,
    roles,
    watch,
    setValue,
  } = useProfileSubmit();

  const selectedRoleId = watch('role');
  const firstName = watch('first_name') || adminInfo?.first_name || 'Admin';

  return (
    <>
      <PageTitle>Edit Profile</PageTitle>

      <div className="container mx-auto max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-12">
        {/* Cover Header Banner */}
        <div className="bg-gradient-to-r from-red-900 via-red-800 to-amber-900 h-32 sm:h-36 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        </div>

        {/* Profile Avatar & Header Info */}
        <div className="px-6 sm:px-8 pb-6 border-b border-gray-100 dark:border-gray-700">
          <div className="-mt-14 sm:-mt-16 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
            <AvatarUploader
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              setUploadedFile={setUploadedFile}
              name={firstName}
            />
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Personal Details</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Update your personal information and account details below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name (Strict Letters Only) */}
            <div>
              <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FiUser className="text-red-800 dark:text-red-400" /> First Name
              </Label>
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
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:bg-white dark:text-gray-200 rounded-md px-4"
              />
              <Error errorName={errors.first_name} />
            </div>

            {/* Last Name (Strict Letters Only) */}
            <div>
              <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FiUser className="text-red-800 dark:text-red-400" /> Last Name
              </Label>
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
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:bg-white dark:text-gray-200 rounded-md px-4"
              />
              <Error errorName={errors.last_name} />
            </div>

            {/* Email Address */}
            <div>
              <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FiMail className="text-red-800 dark:text-red-400" /> Email Address
              </Label>
              <input
                {...register('email', {
                  required: 'Email is required',
                })}
                type="email"
                placeholder="Enter Email Address"
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:bg-white dark:text-gray-200 rounded-md px-4"
              />
              <Error errorName={errors.email} />
            </div>

            {/* Contact Number (Strict 10 Digits Only) */}
            <div>
              <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FiPhone className="text-red-800 dark:text-red-400" /> Contact Number
              </Label>
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
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:bg-white dark:text-gray-200 rounded-md px-4"
              />
              <Error errorName={errors.mobile} />
            </div>

            {/* Your Role (Read-only Badge Display) */}
            <div className="md:col-span-2">
              <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FiShield className="text-red-800 dark:text-red-400" /> Your Role
              </Label>
              <div className="flex items-center h-12 px-4 rounded-md bg-gray-100 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300">
                  {(() => {
                    const currentRole = roles.find((r) => r._id === selectedRoleId || r.role_name === selectedRoleId);
                    return currentRole?.role_name || currentRole?.name || adminInfo?.role_name || adminInfo?.role?.role_name || 'Admin';
                  })()}
                </span>
                <span className="ml-3 text-xs text-gray-400 dark:text-gray-500 font-medium">
                  (Managed by Admin)
                </span>
              </div>
            </div>
          </div>

          {/* Form Action Footer */}
          <div className="flex items-center justify-end gap-4 pt-8 mt-8 border-t border-gray-100 dark:border-gray-700">
            <Button
              type="submit"
              className="h-12 px-8 font-semibold bg-red-800 hover:bg-red-900 text-white rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Update Profile
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProfile;
