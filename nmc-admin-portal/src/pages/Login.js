import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@windmill/react-ui';
import { ImFacebook, ImGoogle } from 'react-icons/im';

import Error from '../components/form/Error';
import LabelArea from '../components/form/LabelAreaProject';
import InputArea from '../components/form/InputArea';
import ImageLight from '../assets/img/login-office.jpeg';
import ImageDark from '../assets/img/login-office-dark.jpeg';
import useLoginSubmit from '../hooks/useLoginSubmit';

const Login = () => {
  const { onSubmit, register, handleSubmit, errors, loading } =
    useLoginSubmit();

  return (
    <>
      <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
          <div className="flex flex-col overflow-y-auto md:flex-row">
            <div className="h-32 md:h-auto md:w-1/2">
              <img
                aria-hidden="true"
                className="object-cover w-full h-full dark:hidden"
                src={ImageLight}
                alt="Office"
              />
              <img
                aria-hidden="true"
                className="hidden object-cover w-full h-full dark:block"
                src={ImageDark}
                alt="Office"
              />
            </div>
            <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
              <div className="w-full">
                <div className="flex items-center gap-3 mb-4">
                  <img src={require('../assets/img/logo/new-logo-1.png')} alt="NMC Logo" className="h-12 max-w-[200px] object-contain" />
                  <div>
                    <h2 className="text-lg font-bold text-red-900 dark:text-white leading-tight">Nandkunvarba Mahila College</h2>
                    <p className="text-xs text-amber-600 font-semibold tracking-wider uppercase">Admin Portal</p>
                  </div>
                </div>
                <h1 className="mb-6 text-xl font-bold text-gray-700 dark:text-gray-200">
                  Login
                </h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <LabelArea label="Email" />
                  <InputArea
                    register={register}
                    // defaultValue="admin@gmail.com"
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="john@doe.com"
                  />
                  <Error errorName={errors.email} />
                  <div className="mt-6"></div>
                  <LabelArea label="Password" />
                  <InputArea
                    register={register}
                    // defaultValue="1234567123"
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="***************"
                  />
                  <Error errorName={errors.password} />

                  <Button
                    disabled={loading}
                    type="submit"
                    className="mt-6 h-12 w-full bg-red-800 hover:bg-red-900 text-white font-bold"
                    to="/dashboard"
                  >
                    Log in
                  </Button>
                  <hr className="my-10 hidden" />
                </form>

                <p className="mt-4">
                  <Link
                    className="text-sm font-medium text-red-800 dark:text-amber-400 hover:underline"
                    to="/forgot-password"
                  >
                    Forgot your password?
                  </Link>
                </p>
                <p className="mt-1">
                  <Link
                    className="hidden text-sm font-medium text-red-800 dark:text-amber-400 hover:underline"
                    to="/signup"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
