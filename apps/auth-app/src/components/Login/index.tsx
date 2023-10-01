import { useLoginMutation } from '@/store/api/userApiSlice';
import { Box, CircularProgress } from '@mui/material';
import { FormEventHandler, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Login() {
  const [requestLogin, { isLoading, isError, error }] = useLoginMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (error) {
      if ('data' in error) {
        const errMsg = error.data as { message: string };
        setErrorMsg(errMsg.message);
      }
    }
  }, [isError, error]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      const res = await requestLogin({
        email,
        password,
      });

      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

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
          <div className="mt-4 px-4  py-2 text-white font-semibold bg-red-400 border rounded-lg">
            {errorMsg}
          </div>
        )}

        <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="mb-2 text-sm font-semibold text-gray-800"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="font-sans bg-gray-50 border border-gray-400 text-gray-900 py-2 px-3 rounded-lg w-full"
              required
              placeholder="Enter your email"
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-2 text-sm font-semibold text-gray-800"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="font-sans bg-gray-50 border border-gray-400 text-gray-900 py-2 px-3 rounded-lg w-full"
              required
              placeholder="********"
              autoComplete="off"
              onChange={(e) => setPassword(e.target.value)}
            />
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
              to="/forgetPassword"
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

export default Login;
