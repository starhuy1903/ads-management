import { Link } from 'react-router-dom';

function Signup() {
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
    <>
      <div className="w-full h-screen flex justify-center items-center bg-white">
        <div className="bg-gray-100 px-12 py-20 rounded-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#101828] mb-2">
              Create an account
            </h1>
            <span>Start your 30-day free trial.</span>
          </div>

          <form className="mt-4 space-y-4 md:space-y-6" action="#">
            <div>
              <label
                htmlFor="name"
                className="mb-2 text-sm font-semibold text-gray-800"
              >
                Name<span className="text-xl text-red-500">*</span>
              </label>
              <input
                type="name"
                name="name"
                id="name"
                className="font-sans bg-gray-50 border border-gray-400 text-gray-900 py-2 px-3 rounded-lg w-full"
                required
                placeholder="Enter your name"
                autoComplete="off"
                // onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-2 text-sm font-semibold text-gray-800"
              >
                Email<span className="text-xl text-red-500">*</span>
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
                Password<span className="text-xl text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="font-sans bg-gray-50 border border-gray-400 text-gray-900 py-2 px-3 rounded-lg w-full"
                required
                placeholder="Create a password"
                autoComplete="off"
                // onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-sm mt-2">Must be at least 8 characters.</p>
            </div>

            <button
              type="submit"
              className="w-full text-white bg-[#7F56D9] py-2 rounded-lg font-semibold"
              // onClick={handleSubmit}
            >
              Get started
            </button>

            <p className="text-sm font-light text-center">
              Already have an account?{' '}
              <Link
                to="/signp"
                className="font-semibold text-[#7F56D9] hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 w-full h-full text-gray-300 bg-white">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            {error && (
              <p className="bg-[#D14D72] text-sm text-white font-bold py-3 px-4 rounded">
                {error}
              </p>
            )}
          </div>
        </div>
      </div> */}
    </>
  );
}
export default Signup;
