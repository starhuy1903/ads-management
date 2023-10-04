import { useAppSelector } from '@/store';
import { useLogoutMutation } from '@/store/api/userApiSlice';
import { Link } from 'react-router-dom';

export default function Header() {
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const [requestLogout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      const res = await requestLogout();

      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed w-full h-[80px] flex justify-center items-center bg-white z-20">
      <div className="max-w-[1350px] w-full flex justify-between items-center text-[#475467] font-bold">
        <div>
          <ul className="hidden md:flex items-center">
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            <li>
              <Link to="/resources">Resources</Link>
            </li>
            <li>
              <Link to="/pricing">Pricing</Link>
            </li>
          </ul>
        </div>

        <div>
          {isLoggedIn ? (
            <ul className="flex items-center">
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <button
                  className="bg-[#7F56D9] text-white py-2 px-3 rounded hover:opacity-90"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          ) : (
            <ul className="flex items-center">
              <li>
                <Link to="/login">Log in</Link>
              </li>
              <li>
                <Link to="/register">
                  <button className="bg-[#7F56D9] text-white py-2 px-3 rounded hover:opacity-90">
                    Sign up
                  </button>
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
