import { useEffect } from 'react';
import 'react-perfect-scrollbar/dist/css/styles.css';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { useAppSelector } from '@/store';
import { useLazyGetProfileQuery } from '@/store/api/userApiSlice';
import { checkRole } from '@/store/slice/userSlice';
import AdsTypesCreate from './Authenticated/CDO/AdsTypesCreate';
import AdsTypesDetail from './Authenticated/CDO/AdsTypesDetail';
import AdsTypesListView from './Authenticated/CDO/AdsTypesListView';
import DistrictsCreate from './Authenticated/CDO/DistrictsCreate';
import DistrictsDetail from './Authenticated/CDO/DistrictsDetail';
import DistrictsListView from './Authenticated/CDO/DistrictsListView';
import LocationTypesCreate from './Authenticated/CDO/LocationTypesCreate';
import LocationTypesDetail from './Authenticated/CDO/LocationTypesDetail';
import LocationTypesListView from './Authenticated/CDO/LocationTypesListView';
import PanelTypesCreate from './Authenticated/CDO/PanelTypesCreate';
import PanelTypesDetail from './Authenticated/CDO/PanelTypesDetail';
import PanelTypesListView from './Authenticated/CDO/PanelTypesListView';
import ReportTypesCreate from './Authenticated/CDO/ReportTypesCreate';
import ReportTypesDetail from './Authenticated/CDO/ReportTypesDetail';
import ReportTypesListView from './Authenticated/CDO/ReportTypesListView';
import WardsCreate from './Authenticated/CDO/WardsCreate';
import WardsDetail from './Authenticated/CDO/WardsDetail';
import WardsListView from './Authenticated/CDO/WardsListView';
import Dashboard from './Authenticated/Dashboard';
import Home from './Authenticated/Home';
import CDOLayout from './Authenticated/Layout/CDOLayout';
import OfficerLayout from './Authenticated/Layout/OfficerLayout';
import EditingRequestDetail from './Authenticated/Officer/EditingRequestDetail';
import EditingRequestList from './Authenticated/Officer/EditingRequestList';
import LicensingRequestDetail from './Authenticated/Officer/LicensingRequestDetail';
import LicensingRequestList from './Authenticated/Officer/LicensingRequestList';
import LocationDetail from './Authenticated/Officer/LocationDetail';
import LocationEditing from './Authenticated/Officer/LocationEditing';
import LocationList from './Authenticated/Officer/LocationList';
import LocationReportDetail from './Authenticated/Officer/LocationReportDetail';
import LocationReportList from './Authenticated/Officer/LocationReportList';
import PanelCreating from './Authenticated/Officer/PanelCreating';
import PanelDetail from './Authenticated/Officer/PanelDetail';
import PanelEditing from './Authenticated/Officer/PanelEditing';
import PanelList from './Authenticated/Officer/PanelList';
import PanelReportDetail from './Authenticated/Officer/PanelReportDetail';
import PanelReportList from './Authenticated/Officer/PanelReportList';
import PanelSendRequest from './Authenticated/Officer/PanelSendRequest';
import ReportResponse from './Authenticated/Officer/ReportResponse';
import ResetPassword from './Authenticated/ResetPassword';
import CenterLoading from './Common/CenterLoading';
import ChangePassword from './Common/ChangePassword';
import PageLayout from './Common/Layout/PageLayout';
import CitizenHome from './Unauthenticated/Citizen/CitizenHome';
import CitizenReport from './Unauthenticated/Citizen/CitizenReport';
import ForgotPassword from './Unauthenticated/ForgotPassword';
import Login from './Unauthenticated/Login';
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
        path: 'ads-types',
        element: <AdsTypesListView />,
      },
      {
        path: 'ads-types/create',
        element: <AdsTypesCreate />,
      },
      {
        path: 'ads-types/:id',
        element: <AdsTypesDetail />,
      },
      {
        path: 'location-types',
        element: <LocationTypesListView />,
      },
      {
        path: 'location-types/create',
        element: <LocationTypesCreate />,
      },
      {
        path: 'location-types/:id',
        element: <LocationTypesDetail />,
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
        path: 'change-password',
        element: <ChangePassword />,
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
        element: <LocationList />,
      },
      {
        path: 'locations/:locationId',
        element: <LocationDetail />,
      },
      {
        path: 'locations/:locationId/edit',
        element: <LocationEditing />,
      },
      {
        path: 'panels',
        element: <PanelList />,
      },
      {
        path: 'panels/:panelId',
        element: <PanelDetail />,
      },
      {
        path: 'panels/create',
        element: <PanelCreating />,
      },
      {
        path: 'panels/:panelId/send-request',
        element: <PanelSendRequest />,
      },
      {
        path: 'panels/:panelId/edit',
        element: <PanelEditing />,
      },
      {
        path: 'location-reports',
        element: <LocationReportList />,
      },
      {
        path: 'location-reports/:reportId',
        element: <LocationReportDetail />,
      },
      {
        path: 'panel-reports',
        element: <PanelReportList />,
      },
      {
        path: 'panel-reports/:reportId',
        element: <PanelReportDetail />,
      },
      {
        path: 'reports/:reportId/response',
        element: <ReportResponse />,
      },
      {
        path: 'licensing-requests',
        element: <LicensingRequestList />,
      },
      {
        path: 'licensing-requests/:requestId',
        element: <LicensingRequestDetail />,
      },
      {
        path: 'editing-requests',
        element: <EditingRequestList />,
      },
      {
        path: 'editing-requests/:requestId',
        element: <EditingRequestDetail />,
      },
      {
        path: 'change-password',
        element: <ChangePassword />,
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
  const [getProfile, { isLoading }] = useLazyGetProfileQuery();
  const { isCDO } = useAppSelector(checkRole);

  const protectedRoutes = isCDO ? CDORoutes : officerRoutes;

  useEffect(() => {
    if (isLoggedIn) {
      getProfile();
    }
  }, [isLoggedIn, getProfile]);

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
