import { Box } from '@mui/material';
import { Avatar } from '@mui/material';
import { useCallback } from 'react';
import { Marker } from 'react-map-gl';
import { useAppDispatch } from '@/store';
import Maps from '@/components/Common/Maps';
import SidebarContainer from '@/components/Common/Sidebar';
import { SidebarKey } from '@/constants/sidebar';
import { showSidebar } from '@/store/slice/sidebar';

export default function CitizenHome() {
  const dispatch = useAppDispatch();

  const handleViewDetailAd = useCallback(() => {
    dispatch(
      showSidebar(SidebarKey.AD_DETAIL, {
        sidebarId: 1, // todo: remove mock
      }),
    );
  }, [dispatch]);

  const renderChildren = () => {
    return (
      <Marker
        longitude={106.6586948}
        latitude={10.8483839}
        anchor="center"
        // popup={popup}
        // ref={markerRef}
      >
        <Avatar
          sx={{ bgcolor: 'blue', width: 20, height: 20, fontSize: '12px' }}
          children="BC"
          onClick={handleViewDetailAd}
        />
      </Marker>
    );
  };
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
        <Maps>{renderChildren()}</Maps>
      </Box>
      <SidebarContainer
        style={{
          height: 'calc(100% - 64px)',
          position: 'absolute',
          top: 64,
          left: 0,
        }}
      />
    </>
  );
}
