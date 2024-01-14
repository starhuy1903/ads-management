import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import { Avatar } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Marker } from 'react-map-gl';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import CitizenNotification from '@/components/Common/Layout/CitizenNotification';
import Maps from '@/components/Common/Maps';
import ActionBar from '@/components/Common/Maps/ActionBar';
import SidebarContainer from '@/components/Common/Sidebar';
import { ModalKey } from '@/constants/modal';
import { SidebarKey } from '@/constants/sidebar';
import { useGetLocationQuery } from '@/store/api/citizen/locationApiSlice';
import { useGetSentReportsQuery } from '@/store/api/citizen/reportApiSlice';
import {
  setIsShowingPlannedLocation,
  setIsShowingViolatedReport,
  setSelectedLocation,
} from '@/store/slice/mapsSlice';
import { showModal } from '@/store/slice/modal';
import { hideSidebar, showSidebar } from '@/store/slice/sidebar';
import { AdLocation } from '@/types/location';
import { CreatedPointReport, CreatedReport } from '@/types/report';
import anonymousUser from '@/utils/anonymous-user';

const isPointReport = (report: CreatedReport): report is CreatedPointReport =>
  report.targetType === 'Point';

export default function CitizenHome() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    isShowingPlannedLocation,
    isShowingViolatedReport,
    selectedLocation,
  } = useAppSelector((state) => state.maps);

  const ref = useRef<any>(null);

  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(null);

  const selectedViewPort = selectedLocation
    ? {
        zoom: 15,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.long,
      }
    : undefined;

  const { data: adLocationData, isLoading: fetchingAllAdsLocation } =
    useGetLocationQuery(undefined, {
      skip: false,
      refetchOnMountOrArgChange: true,
    });
  const { data: vioReports, isLoading: fetchingViolatedReport } =
    useGetSentReportsQuery(anonymousUser.getUserUuid(), {
      skip: false,
      refetchOnMountOrArgChange: true,
    });

  const vioLocationReports = useMemo(
    () => vioReports?.data.filter((report) => report.targetType === 'Location'),
    [vioReports?.data],
  );

  const vioPanelReports = useMemo(
    () => vioReports?.data.filter((report) => report.targetType === 'Panel'),
    [vioReports?.data],
  );

  const vioPointReports = useMemo(
    () => vioReports?.data.filter((report) => report.targetType === 'Point'),
    [vioReports?.data],
  );

  const handleViewLocationDetail = useCallback(
    (loc: AdLocation) => {
      ref.current?.clearMarker();
      dispatch(setSelectedLocation(loc));
      dispatch(
        showSidebar(SidebarKey.AD_DETAIL, {
          location: loc,
          vioLocationReports: vioLocationReports?.filter(
            (report) => report.locationId === loc.id,
          ),
          vioPanelReports,
        }),
      );
    },
    [dispatch, vioLocationReports, vioPanelReports],
  );

  const handleToggleAdPanels = useCallback(
    (value: boolean) => {
      dispatch(setIsShowingPlannedLocation(value));
    },
    [dispatch],
  );

  const handleToggleViolationReport = useCallback(
    (value: boolean) => {
      dispatch(setIsShowingViolatedReport(value));
    },
    [dispatch],
  );

  const handleOpenUserMenu = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElUser(event.currentTarget);
    },
    [],
  );

  const handleCloseUserMenu = useCallback(() => {
    setAnchorElUser(null);
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      dispatch(
        showSidebar(SidebarKey.AD_DETAIL, {
          location: selectedLocation,
          vioLocationReports: vioLocationReports?.filter(
            (report) => report.locationId === selectedLocation.id,
          ),
          vioPanelReports,
        }),
      );
    }

    return () => {
      dispatch(hideSidebar());
    };
  }, [dispatch, selectedLocation, vioLocationReports, vioPanelReports]);

  const renderViolatedPoint = () => {
    if (!vioPointReports) {
      return null;
    }

    return vioPointReports.map((report) => {
      if (isPointReport(report))
        return (
          <Marker
            key={report.id}
            longitude={report.long}
            latitude={report.lat}
            anchor="center"
          >
            <Avatar
              sx={{
                bgcolor: 'red',
                width: 20,
                height: 20,
                fontSize: '10px',
                border: 'none',
              }}
              children=""
              onClick={(e) => {
                e.stopPropagation();
                dispatch(
                  showModal(ModalKey.REPORT_DETAIL, { reports: [report] }),
                );
              }}
            />
          </Marker>
        );

      return null;
    });
  };

  const renderLocationMarkers = () =>
    adLocationData?.data.map((loc) => {
      let bgColor;
      const isViolatedLocation = vioLocationReports?.find(
        (report) => report.locationId === loc.id,
      );
      const isSelected = selectedLocation?.id === loc.id;

      if (loc.isPlanning && isShowingPlannedLocation) {
        return null;
      }

      if (loc.isPlanning && !isShowingPlannedLocation) {
        bgColor = 'rgb(245 158 11)';
      } else if (isShowingViolatedReport && isViolatedLocation) {
        bgColor = 'red';
      } else {
        bgColor = 'blue';
      }

      const hasAdPanel = loc.panel.length > 0 && !loc.isPlanning;

      return (
        <Marker
          key={loc.id}
          longitude={loc.long}
          latitude={loc.lat}
          anchor="center"
        >
          <Avatar
            sx={{
              bgcolor: bgColor,
              width: 20,
              height: 20,
              fontSize: '10px',
              border: isSelected ? '2px solid rgb(103 232 249);' : 'none',
            }}
            children={hasAdPanel ? 'QC' : ''}
            onClick={(e) => {
              e.stopPropagation();
              handleViewLocationDetail(loc);
            }}
          />
        </Marker>
      );
    });

  return (
    <>
      <Box
        position="absolute"
        top={0}
        left={0}
        width="100vw"
        height="100vh"
        zIndex={-1}
        display="flex"
      >
        <Maps
          ref={ref}
          selectedViewPort={selectedViewPort}
          onClearSelectedLocation={() => {
            dispatch(setSelectedLocation(null));
          }}
        >
          {renderLocationMarkers()}
          {isShowingViolatedReport && renderViolatedPoint()}
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
            }}
          >
            <Tooltip title="Notification">
              <CitizenNotification />
            </Tooltip>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 2 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={() => navigate('/login')}>
                <Typography textAlign="center">Log in</Typography>
              </MenuItem>
            </Menu>
          </Box>

          <Box
            sx={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              right: 10,
              background: 'rgb(248 250 252);',
            }}
            padding={1}
          >
            <ActionBar
              isShowingPlannedLocation={isShowingPlannedLocation}
              isShowingViolatedReport={isShowingViolatedReport}
              isGettingAllLocations={fetchingAllAdsLocation}
              isGettingViolatedReport={fetchingViolatedReport}
              onToggleAdPanel={handleToggleAdPanels}
              onToggleViolationReport={handleToggleViolationReport}
            />
          </Box>
        </Maps>
      </Box>
      <SidebarContainer style={{ minWidth: 250, maxWidth: 300 }} />
    </>
  );
}
