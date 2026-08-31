import React, { useContext, useEffect, useState } from 'react'; 
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { SidebarContext } from '../../../context/SidebarContext';
import DrawerButton from '../../form/DrawerButton';
import Title from '../../form/Title';
import Error from '../../form/Error';
import MasterUserService from '../../../services/master/MasterUserService';
import { notifyError, notifySuccess } from '../../../utils/toast';

const PasswordDrawer = ({ userId }) => {
  const { closeDrawer, setIsUpdate } = useContext(SidebarContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    reset(); // Clear form whenever drawer opens
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [userId, reset]);

  const onSubmit = async (data) => {
    if (!data.password || data.password.length < 6) {
      notifyError("Password must be at least 6 characters long!");
      return;
    }

    if (data.password !== data.confirm_password) {
      notifyError("Passwords do not match!");
      return;
    }

    try {
      const res = await MasterUserService.changePassword(userId, {
        new_password: data.password,
        confirm_password: data.confirm_password
      });

      notifySuccess(res.message || "Password updated successfully");
      setIsUpdate(true);
      closeDrawer();
      reset();
    } catch (err) {
      notifyError(err?.response?.data?.message || err.message || "Something went wrong");
    }
  };

  return (
    <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        <Title
          title="Update Password"
          description="Update password for this user"
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="block px-6 pt-8 pb-40">
        {/* Password */}
        <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
          <label className="col-span-2 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-start">
            Password
          </label>
          <div className="col-span-4 relative">
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white dark:text-gray-200 rounded-md pl-4 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none p-1"
              title={showPassword ? "Hide Password" : "Show Password"}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
            <Error errorName={errors.password} />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
          <label className="col-span-2 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-start">
            Confirm Password
          </label>
          <div className="col-span-4 relative">
            <input
              {...register("confirm_password", {
                required: "Confirm Password is required",
                minLength: {
                  value: 6,
                  message: "Confirm Password must be at least 6 characters",
                },
              })}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white dark:text-gray-200 rounded-md pl-4 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none p-1"
              title={showConfirmPassword ? "Hide Password" : "Show Password"}
            >
              {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
            <Error errorName={errors.confirm_password} />
          </div>
        </div>

        <DrawerButton id={userId} title="Password" />
      </form>
    </Scrollbars>
  );
};

export default React.memo(PasswordDrawer);
