import { Box } from '@mui/material';
import { Avatar } from '@mui/material';
import { useCallback } from 'react';
import { Marker } from 'react-map-gl';
import { useAppDispatch } from '@/store';
import Maps from '@/components/Common/Maps';
import SidebarContainer from '@/components/Common/Sidebar';
import { SidebarKey } from '@/constants/sidebar';
import { useGetLocationQuery } from '@/store/api/citizen/locationApiSlice';
import { showSidebar } from '@/store/slice/sidebar';

export default function CitizenHome() {
  const dispatch = useAppDispatch();
  const { data: adsLocationData, isLoading } = useGetLocationQuery();
  // console.log({ data });

  const handleViewDetailAd = useCallback(() => {
    dispatch(
      showSidebar(SidebarKey.AD_DETAIL, {
        sidebarId: 1, // todo: remove mock
      }),
    );
  }, [dispatch]);

  const renderChildren = () => {
    return adsLocationData?.data.map((loc) => (
      <Marker
        key={loc.id}
        longitude={loc.long}
        latitude={loc.lat}
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
    ));
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
