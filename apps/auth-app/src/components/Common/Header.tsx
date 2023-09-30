import { Link } from 'react-router-dom';

export default function Header() {
  const user = null;

  return (
    <div className="fixed w-full h-[80px] flex justify-center items-center bg-white z-20">
      {/* <div>
        <Link to="/home">
          <img
            className="rounded"
            src={Logo}
            alt="Logo"
            style={{ width: '50px', cursor: 'pointer' }}
          />
        </Link>
      </div> */}
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

            {/* {user && (
          <>
            <li>
              <Link
                to={
                  user?.userType === 2
                    ? `profile/${user?._id}`
                    : `company_profile/${user?._id}`
                }
              >
                <img
                  className="rounded-full"
                  src={user?.avatar}
                  alt="Avatar"
                  title="Profile"
                  style={{ width: '50px', cursor: 'pointer' }}
                />
              </Link>
            </li>

            <li>
              <Link to="/logout">
                <button
                  className="bg-[#1B9C85] text-white py-2 px-3 rounded hover:opacity-90"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </Link>
            </li>
          </>
        )} */}
          </ul>
        </div>

        <div>
          {!user && (
            <ul className="flex items-center">
              <li>
                <Link to="/signin">Log in</Link>
              </li>
              <li>
                <Link to="/signup">
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
