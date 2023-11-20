import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { isApiErrorResponse } from '@/store/api/helper';
import { useRegisterMutation } from '@/store/api/userApiSlice';
import { RegisterPayload } from '@/types/user';
import { showError } from '@/utils/toast';
import Status from '../Common/Status';

export default function Register() {
  const [requestRegister, { isLoading }] = useRegisterMutation();
  const [isSentEmail, setIsSentEmail] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterPayload>();
  const onSubmit: SubmitHandler<RegisterPayload> = async (data) => {
    try {
      const res = await requestRegister(data).unwrap();

      if (res.statusCode === 200) {
        setIsSentEmail(true);
      }
    } catch (err) {
      if (isApiErrorResponse(err)) {
        showError(err.data.message);
      }
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-white">
      <div className="bg-gray-100 px-12 py-20 rounded-lg">
        {!isSentEmail ? (
          <>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-[#101828] mb-2">
                Create an account
              </h1>
              <span>Start your 30-day free trial.</span>
            </div>

            <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="mb-2 text-sm font-semibold text-gray-800">
                  Name<span className="text-xl text-red-500">*</span>
                </label>

                <input
                  {...register('name', {
                    required: 'Name is required!',
                    minLength: {
                      value: 3,
                      message: 'Name must be at least 3 characters!',
                    },
                  })}
                  placeholder="Enter your name"
                  aria-invalid={errors.name ? 'true' : 'false'}
                  className="font-sans bg-gray-50 border border-gray-400 text-gray-900 py-2 px-3 rounded-lg w-full"
                  disabled={isLoading}
                />

                {errors.name && (
                  <p className="pt-1 text-sm text-red-600">{`${errors?.name?.message}`}</p>
                )}
              </div>

              <div>
                <label className="mb-2 text-sm font-semibold text-gray-800">
                  Email<span className="text-xl text-red-500">*</span>
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
                  disabled={isLoading}
                />

                {errors.email && (
                  <p className="pt-1 text-sm text-red-600">{`${errors?.email?.message}`}</p>
                )}
              </div>

              <div>
                <label className="mb-2 text-sm font-semibold text-gray-800">
                  Password<span className="text-xl text-red-500">*</span>
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
                    validate: {
                      hasNumber: (value) =>
                        /\d/.test(value) || 'Password must contain a number!',
                      hasUppercase: (value) =>
                        /[A-Z]/.test(value) ||
                        'Password must contain an uppercase letter!',
                      hasLowercase: (value) =>
                        /[a-z]/.test(value) ||
                        'Password must contain a lowercase letter!',
                      hasSpecialChar: (value) =>
                        /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value) ||
                        'Password must contain a special character!',
                    },
                  })}
                  type="password"
                  placeholder="Enter your password"
                  aria-invalid={errors.password ? 'true' : 'false'}
                  className="font-sans bg-gray-50 border border-gray-400 text-gray-900 py-2 px-3 rounded-lg w-full"
                  disabled={isLoading}
                />

                {errors.password && (
                  <p className="pt-1 text-sm text-red-600">{`${errors?.password?.message}`}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full text-white bg-[#7F56D9] py-2 rounded-lg font-semibold"
              >
                {isLoading ? (
                  <span>Loading ...</span>
                ) : (
                  <span>Get started</span>
                )}
              </button>

              <p className="text-sm font-light text-center">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-[#7F56D9] hover:underline"
                >
                  Login
                </Link>
              </p>
            </form>
          </>
        ) : (
          <Status
            status="success"
            title="Verify your email address"
            description="Please check your email and click the link to active your account."
          >
            <div className="flex justify-center">
              <Link
                to="/login"
                className="text-white bg-[#7F56D9] py-2 px-8 rounded-lg font-semibold"
              >
                Back
              </Link>
            </div>
          </Status>
        )}
      </div>
    </div>
  );
}