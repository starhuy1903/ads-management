import { Box } from '@mui/material';
import { Avatar } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Marker } from 'react-map-gl';
import { useAppDispatch, useAppSelector } from '@/store';
import Maps from '@/components/Common/Maps';
import ActionBar from '@/components/Common/Maps/ActionBar';
import SidebarContainer from '@/components/Common/Sidebar';
import { SidebarKey } from '@/constants/sidebar';
import { useLazyGetLocationQuery } from '@/store/api/citizen/locationApiSlice';
import { useLazyGetAllPanelsQuery } from '@/store/api/citizen/panelApiSlice';
import { setIsShowingAdPanel } from '@/store/slice/mapsSlice';
import { showSidebar } from '@/store/slice/sidebar';
import { AdLocation } from '@/types/location';
import { Panel } from '@/types/panel';

export default function CitizenHome() {
  const dispatch = useAppDispatch();
  const { isShowingAdPanel } = useAppSelector((state) => state.maps);
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
    async (value: boolean) => {
      dispatch(setIsShowingAdPanel(value));
      if (value) {
        handleGetAllPanels();
      } else {
        handleGetAdLocation();
      }
    },
    [handleGetAllPanels, handleGetAdLocation, dispatch],
  );

  const renderPanelMarkers = () =>
    panelData?.map((panel) => (
      <Marker
        key={panel.id}
        longitude={panel.location.long}
        latitude={panel.location.lat}
        anchor="center"
      >
        <Avatar
          sx={{ bgcolor: 'blue', width: 20, height: 20, fontSize: '12px' }}
          children="BC"
          onClick={() => handleViewPanelDetail(panel)}
        />
      </Marker>
    ));

  const renderLocationMarkers = () =>
    adLocationData?.map((loc) => (
      <Marker
        key={loc.id}
        longitude={loc.long}
        latitude={loc.lat}
        anchor="center"
      >
        <Avatar
          sx={{ bgcolor: 'blue', width: 20, height: 20, fontSize: '12px' }}
          children=""
          onClick={() => handleViewLocationDetail(loc)}
        />
      </Marker>
    ));

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
              isGettingAllPanels={fetchingAllPanels || fetchingAllAdsLocation}
              onToggleAdPanel={handleToggleAdPanels}
              onToggleViolationReport={() => ({})}
            />
          </Box>
        </Maps>
      </Box>
      <SidebarContainer style={{ minWidth: 250, maxWidth: 300 }} />
    </>
  );
}
