import { Box } from '@mui/material';
import { Avatar } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Marker } from 'react-map-gl';
import { useAppDispatch, useAppSelector } from '@/store';
import Maps from '@/components/Common/Maps';
import ActionBar from '@/components/Common/Maps/ActionBar';
import SidebarContainer from '@/components/Common/Sidebar';
import { SidebarKey } from '@/constants/sidebar';
import { useLazyGetLocationQuery } from '@/store/api/citizen/locationApiSlice';
import { useLazyGetAllPanelsQuery } from '@/store/api/citizen/panelApiSlice';
import { useGetSentReportsQuery } from '@/store/api/citizen/reportApiSlice';
import {
  setIsShowingAdPanel,
  setIsShowingViolatedReport,
} from '@/store/slice/mapsSlice';
import { showSidebar } from '@/store/slice/sidebar';
import { AdLocation } from '@/types/location';
import { Panel } from '@/types/panel';
import anonymousUser from '@/utils/anonymous-user';

export default function CitizenHome() {
  const dispatch = useAppDispatch();
  const { isShowingAdPanel, isShowingViolatedReport } = useAppSelector(
    (state) => state.maps,
  );
  const { data: vioReports, isLoading: fetchingViolatedReport } =
    useGetSentReportsQuery(anonymousUser.getUserUuid());

  const vioLocationReports = useMemo(
    () => vioReports?.data.filter((report) => report.targetType === 'Location'),
    [vioReports?.data],
  );

  const vioPanelReports = useMemo(
    () => vioReports?.data.filter((report) => report.targetType === 'Panel'),
    [vioReports?.data],
  );

  const [getAllPanels, { isLoading: fetchingAllPanels }] =
    useLazyGetAllPanelsQuery();
  const [getAllAdLocations, { isLoading: fetchingAllAdsLocation }] =
    useLazyGetLocationQuery();

  const [mounted, setMounted] = useState(false);

  const [adLocationData, setAdLocationData] = useState<AdLocation[]>();
  const [panelData, setPanelData] = useState<Panel[]>();

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

  const handleViewPanelDetail = useCallback(
    (panel: Panel) => {
      dispatch(
        showSidebar(SidebarKey.AD_DETAIL, {
          panel,
        }),
      );
    },
    [dispatch],
  );

  const handleGetAdLocation = useCallback(async () => {
    try {
      const res = await getAllAdLocations().unwrap();
      setAdLocationData(res.data);
    } catch (error) {
      // handled
    }
  }, [getAllAdLocations]);

  const handleGetAllPanels = useCallback(async () => {
    try {
      const res = await getAllPanels().unwrap();
      setPanelData(res.data);
    } catch (error) {
      // handled
    }
  }, [getAllPanels]);

  const handleToggleAdPanels = useCallback(
    (value: boolean) => {
      dispatch(setIsShowingAdPanel(value));
      if (value) {
        handleGetAllPanels();
      } else {
        handleGetAdLocation();
      }
    },
    [handleGetAllPanels, handleGetAdLocation, dispatch],
  );

  const handleToggleViolationReport = useCallback(
    (value: boolean) => {
      dispatch(setIsShowingViolatedReport(value));
    },
    [dispatch],
  );

  const renderPanelMarkers = () =>
    panelData?.map((panel) => {
      const bgColor =
        isShowingViolatedReport &&
        vioPanelReports?.find((report) => report.panelId === panel.id)
          ? 'red'
          : 'blue';
      return (
        <Marker
          key={panel.id}
          longitude={panel.location.long}
          latitude={panel.location.lat}
          anchor="center"
        >
          <Avatar
            sx={{ bgcolor: bgColor, width: 20, height: 20, fontSize: '12px' }}
            children="BC"
            onClick={() => handleViewPanelDetail(panel)}
          />
        </Marker>
      );
    });

  const renderLocationMarkers = () =>
    adLocationData?.map((loc) => {
      const bgColor =
        isShowingViolatedReport &&
        vioLocationReports?.find((report) => report.locationId === loc.id)
          ? 'red'
          : 'blue';

      return (
        <Marker
          key={loc.id}
          longitude={loc.long}
          latitude={loc.lat}
          anchor="center"
        >
          <Avatar
            sx={{ bgcolor: bgColor, width: 20, height: 20, fontSize: '12px' }}
            children=""
            onClick={() => handleViewLocationDetail(loc)}
          />
        </Marker>
      );
    });

  useEffect(() => {
    if (!mounted) {
      handleToggleAdPanels(isShowingAdPanel);
    }
    setMounted(true);
  }, [handleToggleAdPanels, mounted, isShowingAdPanel]);

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
          {isShowingAdPanel ? renderPanelMarkers() : renderLocationMarkers()}
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
              isShowingAdPanel={isShowingAdPanel}
              isShowingViolatedReport={isShowingViolatedReport}
              isGettingAllPanels={fetchingAllPanels || fetchingAllAdsLocation}
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
