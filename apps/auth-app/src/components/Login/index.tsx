import { Link } from 'react-router-dom';

import { useLoginMutation } from '@/store/api/userApiSlice';
import { Box, CircularProgress } from '@mui/material';


function Login() {
  const [requestLogin, { isLoading }] = useLoginMutation();

  const handleSubmit = async () => {
    try {
      const res = await requestLogin({
        email: 'huy@gmail.com',
        password: '12341234',
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

  // const navigate = useNavigate();
  // const dispatch = useDispatch();
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [error, setError] = useState('');

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!email || !password) {
  //     return alert('Please fill all fields!');
  //   }

  //   const userAuth = {
  //     email,
  //     password,
  //   };

  //   try {
  //     const response = await signIn(userAuth);
  //     if (response.status === 201) {
  //       dispatch(signin(response.data));
  //       navigate('/');
  //     }
  //   } catch (error) {
  //     setError(error.response.data.message);
  //   }
  // };

  return (
      <div className="w-full h-screen flex justify-center items-center bg-white">
        <div className="bg-gray-100 px-12 py-20 rounded-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#101828] mb-2">
              Log in to your account
            </h1>
            <span>Welcome back! Please enter your details.</span>
          </div>

          <form className="mt-4 space-y-4 md:space-y-6" action="#">
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
                // onChange={(e) => setEmail(e.target.value)}
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
                // onChange={(e) => setPassword(e.target.value)}
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
              // onClick={handleSubmit}
            >
              Sign in
            </button>
            <p className="text-sm font-light  text-center">
              Don’t have an account yet?{' '}
              <Link
                to="/signup"
                className="font-semibold text-[#7F56D9] hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
  )
}

export default Login;