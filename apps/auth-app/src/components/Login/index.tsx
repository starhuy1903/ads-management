import { useLoginMutation } from '@/store/api/userApiSlice';
import { CredentialPayload } from '@/types/user';
import { Box, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

export default function Login() {
  const [requestLogin, { isLoading, isError, error }] = useLoginMutation();
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CredentialPayload>();
  const onSubmit: SubmitHandler<CredentialPayload> = async (data) => {
    try {
      const res = await requestLogin(data);

      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (error) {
      if ('data' in error) {
        const errMsg = error.data as { message: string };
        setErrorMsg(errMsg.message);
      }
    }
  }, [isError, error]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-white">
      <div className="bg-gray-100 px-12 py-20 rounded-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#101828] mb-2">
            Log in to your account
          </h1>
          <span>Welcome back! Please enter your details.</span>
        </div>

        {isError && (
          <div className="mt-4 px-4 py-2 text-white font-semibold bg-red-400 border rounded-lg">
            {errorMsg}
          </div>
        )}

        <form className="mt-4 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-2 text-sm font-semibold text-gray-800">
              Email
            </label>

            <input
              {...register('email', {
                required: 'Email is required!',
                pattern: {
                  value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                  message: 'Invalid email address!',
                },
              })}
              type="email"
              placeholder="Enter your email"
              aria-invalid={errors.email ? 'true' : 'false'}
              className="font-sans bg-gray-50 border border-gray-400 text-gray-900 py-2 px-3 rounded-lg w-full"
            />
            {errors.email && (
              <p className="pt-1 text-sm text-red-600">{`${errors?.email?.message}`}</p>
            )}
          </div>

          <div>
            <label className="mb-2 text-sm font-semibold text-gray-800">
              Password
            </label>

            <input
              {...register('password', {
                required: 'Password is required!',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters!',
                },
                maxLength: {
                  value: 20,
                  message: 'Password must be at most 20 characters!',
                },
              })}
              type="password"
              placeholder="Enter your password"
              aria-invalid={errors.password ? 'true' : 'false'}
              className="font-sans bg-gray-50 border border-gray-400 text-gray-900 py-2 px-3 rounded-lg w-full"
            />
            {errors.password && (
              <p className="pt-1 text-sm text-red-600">{`${errors?.password?.message}`}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-5">
                <input
                  id="remember"
                  aria-describedby="remember"
                  type="checkbox"
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50"
                />
              </div>
              <div className="ml-2 text-sm">
                <label htmlFor="remember" className="text-black ">
                  Remember for 30 days
                </label>
              </div>
            </div>

            <Link
              to="/forgot-password"
              className="text-sm font-bold text-[#7F56D9] hover:underline dark:text-primary-500"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full text-white bg-[#7F56D9] py-2 rounded-lg font-semibold"
          >
            Sign in
          </button>

          <p className="text-sm font-light  text-center">
            Don’t have an account yet?{' '}
            <Link
              to="/register"
              className="font-semibold text-[#7F56D9] hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
