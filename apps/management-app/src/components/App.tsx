import 'react-perfect-scrollbar/dist/css/styles.css';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { useAppSelector } from '@/store';
import { useGetProfileQuery } from '@/store/api/userApiSlice';
import { checkRole } from '@/store/slice/userSlice';
import DistrictsManagement from './Authenticated/CDO/DistrictsManagement';
import Dashboard from './Authenticated/Dashboard';
import Home from './Authenticated/Home';
import CDOLayout from './Authenticated/Layout/CDOLayout';
import OfficerLayout from './Authenticated/Layout/OfficerLayout';
import AdsLocation from './Authenticated/Officer/AdsLocation';
import AdsLocationDetail from './Authenticated/Officer/AdsLocationDetail';
import AdsLocationEditing from './Authenticated/Officer/AdsLocationEditing';
import AdsPanel from './Authenticated/Officer/AdsPanel';
import AdsPanelCreating from './Authenticated/Officer/AdsPanelCreating';
import AdsPanelDetail from './Authenticated/Officer/AdsPanelDetail';
import AdsPanelEditing from './Authenticated/Officer/AdsPanelEditing';
import AdsPermission from './Authenticated/Officer/AdsPermission';
import AdsPermissionDetail from './Authenticated/Officer/AdsPermissionDetail';
import ReportDetail from './Authenticated/Officer/ReportDetail';
import ReportResponse from './Authenticated/Officer/ReportResponse';
import ReportTable from './Authenticated/Officer/ReportTable';
import ResetPassword from './Authenticated/ResetPassword';
import CenterLoading from './Common/CenterLoading';
import PageLayout from './Common/Layout/PageLayout';
import CitizenHome from './Unauthenticated/Citizen/CitizenHome';
import CitizenReport from './Unauthenticated/Citizen/CitizenReport';
import ForgotPassword from './Unauthenticated/ForgotPassword';
import Login from './Unauthenticated/Login';
import Register from './Unauthenticated/Register';
import Verify from './Unauthenticated/Verify';

// Culture Department Officer
const CDORoutes = createBrowserRouter([
  {
    path: '/',
    element: <CDOLayout />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'districts',
        element: <DistrictsManagement />,
      },
      {
        path: 'locations',
        element: <div>Ads location</div>,
      },
      {
        path: 'types',
        element: <div>Ads type</div>,
      },
      {
        path: 'points',
        element: <div>Ads point</div>,
      },
      {
        path: 'panels',
        element: <div>Ads panel</div>,
      },
      {
        path: 'request-editing',
        element: <div>Request editing</div>,
      },
      {
        path: 'request-permission',
        element: <div>Request permission</div>,
      },
      {
        path: 'stats',
        element: <div>Ads stats</div>,
      },
      {
        path: 'accounts',
        element: <div>Officer accounts</div>,
      },
      {
        index: true,
        element: <Navigate to={`/dashboard`} />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={`/`} />,
  },
]);

const officerRoutes = createBrowserRouter([
  {
    path: '/',
    element: <OfficerLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'locations',
        element: <AdsLocation />,
      },
      {
        path: 'locations/:locationId',
        element: <AdsLocationDetail />,
      },
      {
        path: 'locations/:locationId/edit',
        element: <AdsLocationEditing />,
      },
      {
        path: 'panels',
        element: <AdsPanel />,
      },
      {
        path: 'panels/:panelId',
        element: <AdsPanelDetail />,
      },
      {
        path: 'panels/create',
        element: <AdsPanelCreating />,
      },
      {
        path: 'panels/:panelId/edit',
        element: <AdsPanelEditing />,
      },
      {
        path: 'reports',
        element: <ReportTable />,
      },
      {
        path: 'reports/:reportId',
        element: <ReportDetail />,
      },
      {
        path: 'reports/:reportId/response',
        element: <ReportResponse />,
      },
      {
        path: 'permissions',
        element: <AdsPermission />,
      },
      {
        path: 'permissions/:permissionId',
        element: <AdsPermissionDetail />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={`/`} />,
  },
]);

const publicRoutes = createBrowserRouter([
  {
    id: 'root',
    children: [
      {
        path: '/',
        element: <PageLayout />,
        children: [
          {
            index: true,
            element: <CitizenHome />,
          },
          {
            path: '/report',
            element: <CitizenReport />,
          },
        ],
      },
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
]);

function App() {
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const { isLoading } = useGetProfileQuery();
  const { isCDO } = useAppSelector(checkRole);

  const protectedRoutes = isCDO ? CDORoutes : officerRoutes;

  if (isLoading) {
    return <CenterLoading />;
  }

  return isLoggedIn ? (
    <RouterProvider router={protectedRoutes} />
  ) : (
    <RouterProvider router={publicRoutes} />
  );
}

export default App;
