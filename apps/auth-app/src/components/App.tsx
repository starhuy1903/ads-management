import { useAppSelector } from '@/store';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import ForgotPassword from './ForgotPassword';
import Home from './Home';
import Login from './Login';
import PageLayout from './PageLayout';
import Register from './Register';
import ResetPassword from './ResetPassword';
import Verify from './Verify';

const protectedRoutes = createBrowserRouter([
  {
    id: 'root',
    element: <PageLayout />,
    children: [{ path: '/', element: <Home /> }],
  },
  {
    path: '*',
    element: <Navigate to={`/`} />,
  },
]);

const publicRoutes = createBrowserRouter([
  {
    element: <PageLayout />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/verify',
        element: <Verify />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: '/reset-password',
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" />,
  },
]);

function App() {
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);

  if (isLoggedIn) {
    return <RouterProvider router={protectedRoutes} />;
  }
  return <RouterProvider router={publicRoutes} />;
}

export default App;
