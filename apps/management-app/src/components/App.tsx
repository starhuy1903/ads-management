import 'react-perfect-scrollbar/dist/css/styles.css';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { useAppSelector } from '@/store';
import { useGetProfileQuery } from '@/store/api/userApiSlice';
import { checkRole } from '@/store/slice/userSlice';
import AdsLocation from './Authenticated/AdsLocation';
import AdsPermission from './Authenticated/AdsPermission';
import DistrictsCreate from './Authenticated/CDO/DistrictsCreate';
import DistrictsDetail from './Authenticated/CDO/DistrictsDetail';
import DistrictsListView from './Authenticated/CDO/DistrictsListView';
import PanelTypesCreate from './Authenticated/CDO/PanelTypesCreate';
import PanelTypesDetail from './Authenticated/CDO/PanelTypesDetail';
import PanelTypesListView from './Authenticated/CDO/PanelTypesListView';
import ReportTypesCreate from './Authenticated/CDO/ReportTypesCreate';
import ReportTypesDetail from './Authenticated/CDO/ReportTypesDetail';
import ReportTypesListView from './Authenticated/CDO/ReportTypesListView';
import WardsCreate from './Authenticated/CDO/WardsCreate';
import WardsDetail from './Authenticated/CDO/WardsDetail';
import WardsListView from './Authenticated/CDO/WardsListView';
import CreateAdsPermission from './Authenticated/CreateAdsPermission';
import CreateEditing from './Authenticated/CreateEditing';
import Dashboard from './Authenticated/Dashboard';
import Home from './Authenticated/Home';
import CDOLayout from './Authenticated/Layout/CDOLayout';
import OfficerLayout from './Authenticated/Layout/OfficerLayout';
import ReportDetail from './Authenticated/ReportDetail';
import ReportTable from './Authenticated/ReportTable';
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
        element: <DistrictsListView />,
      },
      {
        path: 'districts/create',
        element: <DistrictsCreate />,
      },
      {
        path: 'districts/:id',
        element: <DistrictsDetail />,
      },
      {
        path: 'wards',
        element: <WardsListView />,
      },
      {
        path: 'wards/create',
        element: <WardsCreate />,
      },
      {
        path: 'wards/:id',
        element: <WardsDetail />,
      },
      {
        path: 'panel-types',
        element: <PanelTypesListView />,
      },
      {
        path: 'panel-types/create',
        element: <PanelTypesCreate />,
      },
      {
        path: 'panel-types/:id',
        element: <PanelTypesDetail />,
      },
      {
        path: 'report-types',
        element: <ReportTypesListView />,
      },
      {
        path: 'report-types/create',
        element: <ReportTypesCreate />,
      },
      {
        path: 'report-types/:id',
        element: <ReportTypesDetail />,
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
        path: 'locations/edit',
        element: <CreateEditing />,
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
        path: 'permissions',
        element: <AdsPermission />,
      },
      {
        path: 'permissions/new',
        element: <CreateAdsPermission />,
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
