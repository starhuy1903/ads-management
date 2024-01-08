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
import { AdLocation } from '@/types/location';

export default function CitizenHome() {
  const dispatch = useAppDispatch();
  const { data: adLocationData } = useGetLocationQuery();

  const handleViewDetailAd = useCallback(
    (loc: AdLocation) => {
      dispatch(
        showSidebar(SidebarKey.AD_DETAIL, {
          location: loc,
        }),
      );
    },
    [dispatch],
  );

  const renderChildren = () =>
    adLocationData?.data.map((loc) => (
      <Marker
        key={loc.id}
        longitude={loc.long}
        latitude={loc.lat}
        anchor="center"
      >
        <Avatar
          sx={{ bgcolor: 'blue', width: 20, height: 20, fontSize: '12px' }}
          children="BC"
          onClick={() => handleViewDetailAd(loc)}
        />
      </Marker>
    ));

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
          {renderChildren()}
          {/* {selectedLocation && (
            <Popup
              closeOnClick={false}
              longitude={selectedLocation.long}
              latitude={selectedLocation.lat}
              anchor="bottom"
              onClose={() => setSelectedLocation(null)}
            >
              <Box>
                <Typography>{selectedLocation.adType.name}</Typography>
                <Typography>{selectedLocation.type.name}</Typography>
                <Typography>{selectedLocation.fullAddress}</Typography>
                <Typography>
                  {selectedLocation.isPlaning
                    ? 'CHƯA QUY HOẠCH'
                    : 'ĐÃ QUY HOẠCH'}
                </Typography>
              </Box>
            </Popup>
          )} */}
        </Maps>
      </Box>
      <SidebarContainer style={{ minWidth: 250, maxWidth: 300 }} />
    </>
  );
}
