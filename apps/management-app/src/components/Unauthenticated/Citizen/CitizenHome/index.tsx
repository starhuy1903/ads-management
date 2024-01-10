import { Box } from '@mui/material';
import { Avatar } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { Marker } from 'react-map-gl';
import { useAppDispatch, useAppSelector } from '@/store';
import Maps from '@/components/Common/Maps';
import ActionBar from '@/components/Common/Maps/ActionBar';
import SidebarContainer from '@/components/Common/Sidebar';
import { SidebarKey } from '@/constants/sidebar';
import { useGetLocationQuery } from '@/store/api/citizen/locationApiSlice';
import { useGetSentReportsQuery } from '@/store/api/citizen/reportApiSlice';
import {
  setIsShowingPlannedLocation,
  setIsShowingViolatedReport,
} from '@/store/slice/mapsSlice';
import { showSidebar } from '@/store/slice/sidebar';
import { AdLocation } from '@/types/location';
import anonymousUser from '@/utils/anonymous-user';

export default function CitizenHome() {
  const dispatch = useAppDispatch();
  const { isShowingPlannedLocation, isShowingViolatedReport } = useAppSelector(
    (state) => state.maps,
  );
  const { data: adLocationData, isLoading: fetchingAllAdsLocation } =
    useGetLocationQuery();
  const { data: vioReports, isLoading: fetchingViolatedReport } =
    useGetSentReportsQuery(anonymousUser.getUserUuid());

  const vioLocationReports = useMemo(
    () => vioReports?.data.filter((report) => report.targetType === 'Location'),
    [vioReports?.data],
  );

  const handleViewLocationDetail = useCallback(
    (loc: AdLocation) => {
      dispatch(
        showSidebar(SidebarKey.AD_DETAIL, {
          location: loc,
        }),
      );
    },
    [dispatch],
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

  const renderLocationMarkers = () =>
    adLocationData?.data.map((loc) => {
      let bgColor;
      const isViolatedLocation = vioLocationReports?.find(
        (report) => report.locationId === loc.id,
      );

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
            sx={{ bgcolor: bgColor, width: 20, height: 20, fontSize: '12px' }}
            children={hasAdPanel ? 'QC' : ''}
            onClick={() => handleViewLocationDetail(loc)}
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
        <Maps>
          {renderLocationMarkers()}
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
