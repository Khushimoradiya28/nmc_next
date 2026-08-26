import React, { useContext } from 'react';
import { Button } from '@windmill/react-ui';

import Error from '../components/form/Error';
import useProfileSubmit from '../hooks/useProfileSubmit';
import LabelArea from '../components/form/LabelArea';
import InputArea from '../components/form/InputArea';
import { AdminContext } from '../context/AdminContext';
import SelectRole from '../components/form/SelectRole';
import PageTitle from '../components/Typography/PageTitle';
import Uploader from '../components/image-uploader/Uploader';
import Select from 'react-select';

// SingleSelect Component
const SingleSelect = ({ options = [], value = null, onChange, labelKey = 'name', valueKey = '_id', placeholder = '' }) => {
  const formatted = options.map((item) => ({
    value: item[valueKey],
    label: item[labelKey] || item.role_name,
  }));

  const selectedOption = formatted.find((f) => f.value === value) || null;

  return (
    <Select
      options={formatted}
      isMulti={false}
      closeMenuOnSelect={true}
      value={selectedOption}
      onChange={(selected) => onChange(selected ? selected.value : null)}
      className="text-black"
      classNamePrefix="react-select"
      placeholder={placeholder}
    />
  );
};
//USER ROLE


const EditProfile = () => {
  const {
    state: { adminInfo },
  } = useContext(AdminContext);

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
  } = useProfileSubmit(adminInfo._id);




  return (
    <>
      <PageTitle>Edit Profile</PageTitle>
      <div className="container p-6 mx-auto bg-white  dark:bg-gray-800 dark:text-gray-200 rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 flex-grow scrollbar-hide w-full max-h-full">
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Profile Picture" />
              <div className="col-span-8 sm:col-span-4">
                <Uploader
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                  setUploadedFile={setUploadedFile}
                />

              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="First Name" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="First Name"
                  name="first_name"
                  type="text"
                  placeholder="Your Name"
                />
                <Error errorName={errors.first_name} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Last Name" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Last Name"
                  name="last_name"
                  type="text"
                  placeholder="Your Name"
                />
                <Error errorName={errors.last_name} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Email" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Email"
                  name="email"
                  type="text"
                  placeholder="Email"
                />
                <Error errorName={errors.email} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Contact Number" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Contact Number"
                  name="mobile"
                  type="text"
                  placeholder="Contact Number"
                />
                <Error errorName={errors.mobile} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Your Role" />
              <div className="col-span-8 sm:col-span-4">
                <SingleSelect
                  options={roles}
                  value={watch('role') || null}
                  onChange={(val) => setValue('role', val)}
                  labelKey="role_name"
                  valueKey="_id"
                  placeholder="Select Role"
                />
                <Error errorName={errors.role} />
              </div>
            </div>
          </div>

          <div className="flex flex-row-reverse pr-6 pb-6">
            <Button type="submit" className="h-12 px-6">
              {' '}
              Update Profile
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProfile;
