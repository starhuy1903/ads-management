import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { isApiErrorResponse } from '@/store/api/helper';
import { useForgotPasswordMutation } from '@/store/api/userApiSlice';
import { ForgotPasswordPayload } from '@/types/user';
import { showError } from '@/utils/toast';
import Status from '../Common/Status';

export default function ForgotPassword() {
  const [requestForgetPassword, { isLoading }] = useForgotPasswordMutation();
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordPayload>();
  const onSubmit: SubmitHandler<ForgotPasswordPayload> = async (data) => {
    try {
      const res = await requestForgetPassword(data).unwrap();

      if (res.statusCode === 200) {
        setIsSent(true);
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
        {!isSent ? (
          <>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-[#101828] mb-2">
                Find your account
              </h1>
              <span>
                Please enter your email address to reset your account.
              </span>
            </div>

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
                  disabled={isLoading}
                />

                {errors.email && (
                  <p className="pt-1 text-sm text-red-600">{`${errors?.email?.message}`}</p>
                )}
              </div>

              <div className="flex justify-end">
                <Link
                  to="/login"
                  className="text-black bg-gray-300 px-6 py-2 rounded-lg font-semibold mr-2"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="w-1/3 text-white bg-[#7F56D9] py-2 px-2 rounded-lg font-semibold"
                >
                  {isLoading ? (
                    <span>Loanding ...</span>
                  ) : (
                    <span>Continue</span>
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <Status
            status="success"
            title="Check your email"
            description="Please check your email for a password reset link. If have any questions, please visit our support page for more help."
          />
        )}
      </div>
    </div>
  );
}
