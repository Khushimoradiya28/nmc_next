import Cookies from 'js-cookie';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { AdminContext } from '../../src/context/AdminContext';
import AdminServices from '../../src/services/AdminServices';
import { notifyError, notifySuccess } from '../../src/utils/toast';

const useLoginSubmit = () => {
  const [loading, setLoading] = useState(false);
  const { dispatch } = useContext(AdminContext);
  const history = useHistory();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const res = await AdminServices.loginAdmin({
        email: data.email,
        password: data.password,
      });

      const user = res.user;
      const token = res.token;

      if (!token || !user) {
        notifyError("Invalid email or password");
        setLoading(false);
        return;
      }
      
      Cookies.set("adminInfo", JSON.stringify(user));
      Cookies.set("adminToken", token);
      Cookies.set("adminUserId", user._id);

      dispatch({
        type: "USER_LOGIN",
        payload: { ...user, token },
      });

      notifySuccess("Login successful!");
      history.push("/dashboard");

    } 
    catch (err) {
      notifyError("Invalid email or password");
    } 
    finally {
      setLoading(false);
    }
  };

  return {
    onSubmit,
    register,
    handleSubmit,
    errors,
    loading,
  };
};

export default useLoginSubmit;
