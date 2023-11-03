import 'react-perfect-scrollbar/dist/css/styles.css';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { useAppSelector } from '@/store';
import AdminLayout from './Admin/AdminLayout';
import AdminDashboard from './Admin/AdminDashboard';
import CategoriesPage from './Admin/CategoriesPage';
import ItemsPage from './Admin/ItemsPage';
import Home from './Home';
import Login from './Login';
import PageLayout from './PageLayout';
import Register from './Register';
import SettingsPage from './Admin/SettingsPage';

import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import Verify from "./Verify";

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
        path: "/verify",
        element: <Verify />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate replace to='/admin/dashboard' />,
      },
      {
        path: '/admin/dashboard',
        element: <AdminDashboard />,
      },
      {
        path: '/admin/categories',
        element: <CategoriesPage />,
      },
      {
        path: '/admin/items',
        element: <ItemsPage />,
      },
      {
        path: '/admin/settings',
        element: <SettingsPage/>
      }
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" />,
  },
]);

function App() {
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);

  return isLoggedIn ? (
    <RouterProvider router={protectedRoutes} />
  ) : (
    <RouterProvider router={publicRoutes} />
  );
}

export default App;
