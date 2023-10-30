import { Button } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '@/store';
import { ModalKey } from '@/constants/modal';
import { isApiErrorResponse } from '@/store/api/helper';
import { useLoginMutation } from '@/store/api/userApiSlice';
import { showModal } from '@/store/slice/modal';
import { CredentialPayload } from '@/types/user';
import { showError } from '@/utils/toast';

export default function Login() {
  const dispatch = useAppDispatch();
  const [requestLogin, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CredentialPayload>();
  const onSubmit: SubmitHandler<CredentialPayload> = async (data) => {
    try {
      await requestLogin(data).unwrap();
    } catch (err) {
      if (isApiErrorResponse(err)) {
        showError(err.data.message);
      }
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-white">
      <div className="bg-gray-100 px-12 py-20 rounded-lg">
        <div className="text-center">
          <Button onClick={() => dispatch(showModal(ModalKey.CREATE_CATEGORY))}>
            Open Modal
          </Button>
          <h1 className="text-3xl font-bold text-[#101828] mb-2">
            Log in to your account
          </h1>
          <span>Welcome back! Please enter your details.</span>
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
              disabled={isLoading}
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
              to="/forget-password"
              className="text-sm font-bold text-[#7F56D9] hover:underline dark:text-primary-500"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full text-white bg-[#7F56D9] py-2 rounded-lg font-semibold"
          >
            {isLoading ? <span>Loading...</span> : <span>Sign in</span>}
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
