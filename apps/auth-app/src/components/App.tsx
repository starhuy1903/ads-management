import { useAppSelector } from '@/store';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import PageLayout from './PageLayout';
import Register from './Register';

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
