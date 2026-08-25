  import React from 'react';
  import { Scrollbars } from 'react-custom-scrollbars-2';

  import Title from '../../form/Title';
  import Error from '../../form/Error';
  import LabelArea from '../../form/LabelArea';
  import InputArea from '../../form/InputArea';
  import DrawerButton from '../../form/DrawerButton';
  import { useContext, useEffect, useState } from 'react';
  import { useForm } from 'react-hook-form';
  import Uploader from '../../image-uploader/Uploader';
  import { SidebarContext } from '../../../context/SidebarContext';
  import MasterUserService from '../../../services/master/MasterUserService';
  import AllUserRoles from '../../../services/master/UserRoleService';
  import { notifyError, notifySuccess } from '../../../utils/toast';
  import Select from 'react-select';

    //USER ROLE
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

  const useMasteruserSubmit = (id) => {
    const [imageUrl, setImageUrl] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [roles, setRoles] = useState([]);
    const { closeDrawer, setIsUpdate } = useContext(SidebarContext);

    const {
      register,
      watch,
      handleSubmit,
      setValue,
      reset,
      clearErrors,
      formState: { errors },
    } = useForm();

    // Fetch Roles
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
    // Fetch Roles

    //RESET FORM 
    const { isDrawerOpen } = useContext(SidebarContext);

      useEffect(() => {
        if (!id && isDrawerOpen) {
          // Reset form fields
          setValue("first_name", "");
          setValue("last_name", "");
          setValue("email", "");
          setValue("mobile", "");
          setValue("password", "");
          setValue('role', null);
          setImageUrl("");
          setUploadedFile(null);
          clearErrors();
        }
      }, [id, setValue, isDrawerOpen, clearErrors]);
    //RESET FORM 

    //GET VALUES
  useEffect(() => {
  if (!id) return;

  MasterUserService.getBrandById(id)
    .then((res) => {
      const masteruser = res.data[0];

      reset({
        first_name: masteruser.first_name || "",
        last_name: masteruser.last_name || "",
        email: masteruser.email || "",
        mobile: masteruser.mobile || "",
        role: masteruser.role_id || masteruser.role?._id || null,
        password: "",
      });

      setImageUrl(masteruser.profile_img || "");
      setUploadedFile(null);
    })
    .catch((err) => notifyError(err.message));
}, [id]);

    
    //GET VALUES 


    // FORM SUBMISSION 
    const onSubmit = (data) => {
      if (!uploadedFile && !id) {
        notifyError("User image is required!");
        return;
      }
    
      const formData = new FormData();
      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("email", data.email);
      formData.append("mobile", data.mobile);
      formData.append("password", data.password);
      formData.append('role_id', data.role || '');

      if (uploadedFile) {
        formData.append("profile_img", uploadedFile);
      }
    
      if (id) {
        MasterUserService.updateBrand(id, formData)
          .then((res) => {
            notifySuccess(res.message);
            setIsUpdate(true);
            closeDrawer();
          })
          .catch((err) => notifyError(err.message));
      } else {
        MasterUserService.addBrand(formData)
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
      setUploadedFile,
      roles,
      watch,
      setValue
    };
  };


  const MasterUserDrawer = ({ id }) => {
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
      setValue
    } = useMasteruserSubmit(id);

    return (
      <>
        <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {id ? (
            <Title
              title="Update User"
              description="Update your User and related information here"
            />
          ) : (
            <Title
              title="Add User"
              description="Add a new User and its details here"
            />
          )}
        </div>

        <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">

          <form onSubmit={handleSubmit(onSubmit)} className="block">
          <div className="px-6 pt-8 flex-grow w-full h-full max-h-full pb-40 md:pb-32 lg:pb-32 xl:pb-32">
            
            {/* First Name */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="First Name" />
              <div className="col-span-8 sm:col-span-4">
               <InputArea
                    register={register}
                    required={!id}
                    name="first_name"
                    type="text"
                    placeholder="First Name"
                  />
                <Error errorName={errors.first_name} />
              </div>
            </div>
            {/* Last Name*/}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Last Name" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  required
                  name="last_name"
                  type="text"
                  placeholder="Last Name"
                />
                <Error errorName={errors.last_name} />
              </div>
            </div>
            {/* Email*/}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Email" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  required
                  name="email"
                  type="email"
                  placeholder="Email"
                />
                <Error errorName={errors.email} />
              </div>
            </div>
            {/* Mobile*/}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Mobile" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  required
                  name="mobile"
                  type="text"
                  placeholder="Mobile"
                />
                <Error errorName={errors.mobile} />
              </div>
            </div>

              {/* Role */}
              <div className="grid grid-cols-6 gap-6 mb-6">
                <LabelArea label="Role" />
                <div className="col-span-4 mt-2">
                  <SingleSelect
                    options={roles}
                    value={watch("role") || null}
                    onChange={(val) => setValue("role", val)}
                    labelKey="role_name"
                    valueKey="_id"
                    placeholder="Select Role"
                  />
                </div>
              </div>

            {/* Password */}
            {/* <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Password" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  required
                  name="password"
                  type="text"
                  placeholder="password"
                />
                <Error errorName={errors.password} />
              </div>
            </div> */}
            
            {/* Password – show only when ADDING a new user */}
            {!id && (
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Password" />
                <div className="col-span-8 sm:col-span-4">
                  <InputArea
                    register={register}
                    required
                    name="password"
                    type="text"
                    placeholder="Password"
                  />
                  <Error errorName={errors.password} />
                </div>
              </div>
            )}

              {/* User Image */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="User Image" />
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
