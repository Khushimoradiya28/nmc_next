import React, { useContext, useEffect } from 'react'; 
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useForm } from 'react-hook-form';
import { SidebarContext } from '../../../context/SidebarContext';
import DrawerButton from '../../form/DrawerButton';
import Title from '../../form/Title';
import InputArea from '../../form/InputArea';
import Error from '../../form/Error';
import MasterUserService from '../../../services/master/MasterUserService';
import { notifyError, notifySuccess } from '../../../utils/toast';

const PasswordDrawer = ({ userId }) => {
  const { closeDrawer, setIsUpdate } = useContext(SidebarContext);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    reset(); // Clear form whenever drawer opens
  }, [userId, reset]);

  const onSubmit = async (data) => {
    if (data.password !== data.confirm_password) {
      notifyError("Passwords do not match!");
      return;
    }

    try {
      const res = await MasterUserService.changePassword(userId, {
        old_password: data.old_password,
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
        <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
          <label className="col-span-2 text-sm font-medium text-gray-700 dark:text-gray-300 flex justify-center mt-6">Password</label>
          <div className="col-span-4">
            <InputArea
              register={register}
              required
              name="password"
              type="password"
              placeholder="New Password"
            />
            <Error errorName={errors.password} />
          </div>
        </div>

        <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
          <label className="col-span-2 text-sm font-medium text-gray-700 dark:text-gray-300 flex justify-center mt-6">Confirm Password</label>
          <div className="col-span-4">
            <InputArea
              register={register}
              required
              name="confirm_password"
              type="password"
              placeholder="Confirm Password"
            />
            <Error errorName={errors.confirm_password} />
          </div>
        </div>

        <DrawerButton id={userId} title="Password" />
      </form>
    </Scrollbars>
  );
};

export default React.memo(PasswordDrawer);
