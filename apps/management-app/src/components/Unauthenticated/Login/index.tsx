import { useLoginMutation } from '@/store/api/userApiSlice';
import { CredentialPayload } from '@/types/user';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

export default function Login() {
  const [requestLogin, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CredentialPayload>();
  const onSubmit: SubmitHandler<CredentialPayload> = (data) => {
    requestLogin(data);
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-white">
      <div className="bg-gray-100 px-12 py-20 rounded-lg">
        <div className="text-center">
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
            <Link
              to="/forgot-password"
              className="text-sm font-bold text-[#7F56D9] hover:underline dark:text-primary-500"
            >
              Forgot password?
            </Link>
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full text-white bg-[#7F56D9] py-2 rounded-lg font-semibold"
          >
            {isLoading ? <span>Loading...</span> : <span>Sign in</span>}
          </button>

          <Link to="/">
            <button className="w-full text-white bg-gray-300 py-2 rounded-lg font-semibold mt-4">
              Back
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}
