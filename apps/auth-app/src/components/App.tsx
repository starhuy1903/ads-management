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
        path: '/verify/:verifyToken',
        element: <Verify />,
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
