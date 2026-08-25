import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router';

import { AdminContext } from '../context/AdminContext';
import { SidebarContext } from '../context/SidebarContext';
import { notifyError, notifySuccess } from '../utils/toast';
import MasterUserService from '../services/master/MasterUserService';
import AllUserRoles from '../services/master/UserRoleService';


const useProfileSubmit = (id) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const { state } = useContext(AdminContext);
  const token = Cookies.get('token');

  const [roles, setRoles] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);



  // 🔹 Fetch roles
  useEffect(() => {
    let isMounted = true;

    AllUserRoles.getAllUserRoles()
      .then((res) => {
        if (isMounted) setRoles(res?.data || []);
      })
      .catch((err) => notifyError(err.message));

    return () => {
      isMounted = false;
    };
  }, []);

  // 🔹 Fetch user & prefill form
  useEffect(() => {
    if (!id) return;

    const loadUser = async () => {
      try {
        const res = await MasterUserService.getAllBrands({ _id: id });
        const user = res?.data?.[0];
        if (!user) return;

        setValue('first_name', user.first_name || '');
        setValue('last_name', user.last_name || '');
        setValue('email', user.email || '');
        setValue('mobile', user.mobile || '');
        setValue('role', user.role?._id || user.role || '');
        setImageUrl(user.profile_img || '');   // existing image
        setUploadedFile(null);           // reset file
      } catch {
        notifyError('Failed to load user data');
      }
    };

    loadUser();
  }, [id, setValue]);


  // 🔹 Submit update
  // const onSubmit = async (data) => {
  //   try {
  //     const formData = new FormData();

  //     formData.append('first_name', data.first_name);
  //     formData.append('last_name', data.last_name);
  //     formData.append('email', data.email);
  //     formData.append('mobile', data.mobile);
  //     formData.append('role', data.role);

  //     if (uploadedFile) {
  //       formData.append('image', uploadedFile); // SAME as Brand
  //     }

  //     await MasterUserService.updateBrand(id, formData, token);
  //     notifySuccess('Profile updated successfully');
  //   } catch {
  //     notifyError('Profile update failed');
  //   }
  // };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append('first_name', data.first_name);
      formData.append('last_name', data.last_name);
      formData.append('email', data.email);
      formData.append('mobile', data.mobile);
      formData.append('role', data.role);

      if (uploadedFile) {
        formData.append('profile_img', uploadedFile);
      }

      await MasterUserService.updateBrand(id, formData, token);

      notifySuccess('Profile updated successfully');
    } catch (err) {
      notifyError('Profile update failed');
      console.error(err);
    }
  };



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
    setValue,
  };


};


export default useProfileSubmit;
