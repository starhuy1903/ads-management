import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';
import { isApiErrorResponse } from '@/store/api/helper';
import { useResetPasswordMutation } from '@/store/api/userApiSlice';
import { ResetPasswordPayload } from '@/types/user';
import { showError } from '@/utils/toast';
import Status from '../../Common/Status';

export default function ResetPassword() {
  const [urlParams] = useSearchParams();
  const verifyToken = urlParams.get('token') || '';

  const [requestResetPassword, { isLoading }] = useResetPasswordMutation();
  const [isReset, setIsReset] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordPayload>();

  const onSubmit: SubmitHandler<{
    newPassword: string;
  }> = async (data) => {
    try {
      const res = await requestResetPassword({
        newPassword: data.newPassword,
        verifyToken,
      }).unwrap();

      if (res.statusCode === 200) {
        setIsReset(true);
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
        {!isReset ? (
          <>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-[#101828] mb-2">
                Reset Password
              </h1>
              <span>Enter a new password to reset your password.</span>
            </div>

            <form className="mt-4 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="mb-2 text-sm font-semibold text-gray-800">
                  Password<span className="text-xl text-red-500">*</span>
                </label>

                <input
                  {...register('newPassword', {
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
                  aria-invalid={errors.newPassword ? 'true' : 'false'}
                  className="font-sans bg-gray-50 border border-gray-400 text-gray-900 py-2 px-3 rounded-lg w-full"
                  disabled={isLoading}
                />

                {errors.newPassword && (
                  <p className="pt-1 text-sm text-red-600">{`${errors?.newPassword?.message}`}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full text-white bg-[#7F56D9] py-2 rounded-lg font-semibold"
              >
                {isLoading ? (
                  <span>'Loading...'</span>
                ) : (
                  <span>'Reset Password'</span>
                )}
              </button>
            </form>
          </>
        ) : (
          <Status
            status="success"
            title="Password Changed!"
            description="Your password has been reset. Please login to continue."
          >
            <div className="flex justify-center">
              <Link
                to="/login"
                className="text-white bg-[#7F56D9] py-2 px-8 rounded-lg font-semibold"
              >
                Continue
              </Link>
            </div>
          </Status>
        )}
      </div>
    </div>
  );
}
