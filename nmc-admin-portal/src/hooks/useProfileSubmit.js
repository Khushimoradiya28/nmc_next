import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';

import { AdminContext } from '../context/AdminContext';
import { notifyError, notifySuccess } from '../utils/toast';
import MasterUserService from '../services/master/MasterUserService';
import AllUserRoles from '../services/master/UserRoleService';

const useProfileSubmit = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const { state, dispatch } = useContext(AdminContext);
  const token = Cookies.get('adminToken') || Cookies.get('token');

  const [roles, setRoles] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  // 1. Fetch roles
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

  // 2. Fetch logged in user & prefill form dynamically
  useEffect(() => {
    const adminInfo = state?.adminInfo || (Cookies.get('adminInfo') ? JSON.parse(Cookies.get('adminInfo')) : null);
    const activeUserId = adminInfo?._id || adminInfo?.id || Cookies.get('adminUserId');

    // Immediate optimistic populate from session state
    if (adminInfo) {
      setValue('first_name', adminInfo.first_name || '');
      setValue('last_name', adminInfo.last_name || '');
      setValue('email', adminInfo.email || '');
      setValue('mobile', adminInfo.mobile || '');
      setValue('role', adminInfo.role?._id || adminInfo.role || '');
      setImageUrl(adminInfo.profile_img_webp_url || adminInfo.profile_img_url || adminInfo.profile_img || adminInfo.image || '');
    }

    if (!activeUserId) return;

    // Fetch fresh details from backend
    MasterUserService.getAllBrands({ _id: activeUserId, limit: 1 })
      .then((res) => {
        const user = res?.data?.[0];
        if (!user) return;

        setValue('first_name', user.first_name || '');
        setValue('last_name', user.last_name || '');
        setValue('email', user.email || '');
        setValue('mobile', user.mobile || '');
        setValue('role', user.role?._id || user.role || '');
        setImageUrl(user.profile_img_webp_url || user.profile_img_url || user.profile_img || '');
        setUploadedFile(null);
      })
      .catch((err) => {
        console.error('Failed to load fresh user data:', err);
      });
  }, [state?.adminInfo, setValue]);

  // 3. Submit dynamic update
  const onSubmit = async (data) => {
    const adminInfo = state?.adminInfo || (Cookies.get('adminInfo') ? JSON.parse(Cookies.get('adminInfo')) : null);
    const activeUserId = adminInfo?._id || adminInfo?.id || Cookies.get('adminUserId');

    if (!data.first_name || !/^[A-Za-z\s]+$/.test(data.first_name.trim())) {
      notifyError('First name must contain letters only!');
      return;
    }
    if (!data.last_name || !/^[A-Za-z\s]+$/.test(data.last_name.trim())) {
      notifyError('Last name must contain letters only!');
      return;
    }
    if (!data.mobile || !/^\d{10}$/.test(data.mobile.trim())) {
      notifyError('Mobile number must be exactly 10 digits!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('first_name', data.first_name.trim());
      formData.append('last_name', data.last_name.trim());
      formData.append('email', data.email.trim());
      formData.append('mobile', data.mobile.trim());
      if (data.role) formData.append('role_id', data.role);

      if (uploadedFile) {
        formData.append('profile_img', uploadedFile);
      }

      const res = await MasterUserService.updateBrand(activeUserId, formData, token);

      if (res) {
        notifySuccess(res.message || 'Profile updated successfully');

        // Update local session cookie so header avatar refreshes immediately
        const updatedAdminInfo = {
          ...(adminInfo || {}),
          first_name: data.first_name.trim(),
          last_name: data.last_name.trim(),
          email: data.email.trim(),
          mobile: data.mobile.trim(),
          ...(res.data?.profile_img_url ? { profile_img_url: res.data.profile_img_url, image: res.data.profile_img_url } : {}),
        };
        Cookies.set('adminInfo', JSON.stringify(updatedAdminInfo));
        dispatch({ type: 'USER_LOGIN', payload: updatedAdminInfo });
      }
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message || 'Profile update failed');
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
