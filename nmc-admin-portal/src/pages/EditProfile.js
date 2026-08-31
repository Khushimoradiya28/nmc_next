import React, { useContext } from 'react';
import { Button, Label } from '@windmill/react-ui';
import { FiCamera, FiUser, FiMail, FiPhone, FiShield } from 'react-icons/fi';

import Error from '../components/form/Error';
import useProfileSubmit from '../hooks/useProfileSubmit';
import InputArea from '../components/form/InputArea';
import { AdminContext } from '../context/AdminContext';
import PageTitle from '../components/Typography/PageTitle';
import Select from 'react-select';

// Custom Profile Avatar Uploader Component
const AvatarUploader = ({ imageUrl, setImageUrl, setUploadedFile }) => {
  const fallbackImg = 'https://runrkids.s3.ap-south-1.amazonaws.com/media/default/default.png';

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (setUploadedFile) {
      setUploadedFile(file);
    }
    setImageUrl(URL.createObjectURL(file));
  };

  let resolvedSrc = fallbackImg;
  if (imageUrl) {
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('blob:')) {
      resolvedSrc = imageUrl;
    } else {
      const backendBase = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
      let cleanPath = imageUrl;
      if (!imageUrl.startsWith('/')) {
        if (imageUrl.startsWith('media/') || imageUrl.startsWith('uploads/')) {
          cleanPath = `/${imageUrl}`;
        } else {
          cleanPath = `/media/certificate_courses/${imageUrl}`;
        }
      }
      resolvedSrc = `${backendBase}${cleanPath}`;
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
      {/* Circle Avatar with Camera Badge */}
      <label htmlFor="profile_avatar_upload" className="relative group flex-shrink-0 cursor-pointer" title="Click to upload profile photo">
        <img
          src={resolvedSrc}
          alt="Profile Preview"
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-xl ring-4 ring-red-900/10 bg-white dark:bg-gray-700 transition group-hover:opacity-90"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImg;
          }}
        />
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

      {/* Hints */}
      <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1 pb-1">
        {/* <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
          Click photo or camera icon to update
        </p> */}
        {/* <p className="text-xs text-gray-400 dark:text-gray-500">
          Recommended: Square image, PNG, JPG or WEBP (Max 5MB)
        </p> */}
      </div>
    </div>
  );
};

// SingleSelect Component
const SingleSelect = ({ options = [], value = null, onChange, placeholder = '' }) => {
  const formatted = options.map((item) => ({
    value: item._id,
    label: item.name || item.role_name,
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
  } = useProfileSubmit(adminId);

  const selectedRoleId = watch('role');

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
            />
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Personal Details</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Update your personal information and account details below.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FiUser className="text-red-800 dark:text-red-400" /> First Name
              </Label>
              <InputArea
                register={register}
                label="First Name"
                name="first_name"
                type="text"
                placeholder="Enter First Name"
              />
              <Error errorName={errors.first_name} />
            </div>

            {/* Last Name */}
            <div>
              <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FiUser className="text-red-800 dark:text-red-400" /> Last Name
              </Label>
              <InputArea
                register={register}
                label="Last Name"
                name="last_name"
                type="text"
                placeholder="Enter Last Name"
              />
              <Error errorName={errors.last_name} />
            </div>

            {/* Email */}
            <div>
              <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FiMail className="text-red-800 dark:text-red-400" /> Email Address
              </Label>
              <InputArea
                register={register}
                label="Email"
                name="email"
                type="email"
                placeholder="Enter Email Address"
              />
              <Error errorName={errors.email} />
            </div>

            {/* Contact Number */}
            <div>
              <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FiPhone className="text-red-800 dark:text-red-400" /> Contact Number
              </Label>
              <InputArea
                register={register}
                label="Contact Number"
                name="mobile"
                type="text"
                placeholder="Enter Contact Number"
              />
              <Error errorName={errors.mobile} />
            </div>

            {/* Role */}
            <div className="md:col-span-2">
              <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FiShield className="text-red-800 dark:text-red-400" /> Your Role
              </Label>
              <SingleSelect
                options={roles}
                value={selectedRoleId || null}
                onChange={(val) => setValue('role', val)}
                placeholder="Select Role"
              />
              <Error errorName={errors.role} />
            </div>
          </div>

          {/* Form Action Footer */}
          <div className="flex items-center justify-end gap-4 pt-8 mt-8 border-t border-gray-100 dark:border-gray-700">
            <Button
              type="submit"
              className="h-12 px-8 font-semibold bg-red-800 hover:bg-red-900 text-white rounded-xl shadow-md transition-all"
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



