import { Box, Typography } from '@mui/material';
import { Avatar } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Marker, Popup } from 'react-map-gl';
import { useAppDispatch } from '@/store';
import Maps from '@/components/Common/Maps';
import SidebarContainer from '@/components/Common/Sidebar';
import { SidebarKey } from '@/constants/sidebar';
import {
  useGetLocationQuery,
  useLazyGetLocationQuery,
  useLazyGetPanelByLocationQuery,
} from '@/store/api/citizen/locationApiSlice';
import { showSidebar } from '@/store/slice/sidebar';
import { AdLocation } from '@/types/location';

export default function CitizenHome() {
  const dispatch = useAppDispatch();
  const { data: adLocationData, isLoading: fetchingAdLocation } =
    useGetLocationQuery();
  const [getLocations] = useLazyGetLocationQuery();
  const [getPanels, { isLoading: fetchingPanels }] =
    useLazyGetPanelByLocationQuery();
  const [selectedLocation, setSelectedLocation] = useState<AdLocation | null>(
    null,
  );

  const handleViewDetailAd = useCallback(
    async (loc: AdLocation) => {
      setSelectedLocation(loc);
      const res = await getPanels(loc.id).unwrap();
      console.log({ res });

      dispatch(
        showSidebar(SidebarKey.AD_DETAIL, {
          panels: res.data,
        }),
      );
    },
    [dispatch, getPanels],
  );

  useEffect(() => {
    (async () => {
      const res = await getLocations().unwrap();
      console.log({ res });
    })();
    dispatch(
      showSidebar(SidebarKey.AD_DETAIL, {
        panels: [
          {
            id: 11,
            typeId: 1,
            width: '10',
            height: '20',
            locationId: 5,
            imageUrls: [],
            createContractDate: '2023-12-23T00:00:00.000Z',
            expiredContractDate: '2024-12-23T00:00:00.000Z',
            companyEmail: 'example@example.com',
            companyNumber: '123456789',
            createdAt: '2024-01-02T13:54:38.051Z',
            updatedAt: '2024-01-02T13:54:38.051Z',
            status: 'DRAFT',
            belongPanelId: null,
            type: {
              id: 1,
              name: 'Trụ bảng hiflex',
            },
            location: {
              id: 5,
              lat: '5',
              long: '20',
              isPlanning: true,
              districtId: 1,
              wardId: 1,
              fullAddress: '227 Nguyen Van Cu',
              typeId: 1,
              adTypeId: 1,
              imageUrls: [],
              createdAt: '2023-12-30T06:38:36.934Z',
              updatedAt: '2023-12-30T06:38:36.934Z',
              name: 'Location 1',
              belongLocationId: null,
              status: 'APPROVED',
              district: {
                id: 1,
                name: 'Thành Phố Thủ Đức',
              },
              ward: {
                id: 1,
                name: 'Phường An Khánh',
                districtId: 1,
              },
              type: {
                id: 1,
                name: 'Đất công/Công viên/Hành lang an toàn giao thông',
              },
              adType: {
                id: 1,
                name: 'Cổ động chính trị',
              },
            },
          },
        ],
      }),
    );
  }, [dispatch]);

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
          {selectedLocation && (
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
          )}
        </Maps>
      </Box>
      <SidebarContainer style={{ minWidth: 250, maxWidth: 300 }} />
    </>
  );
}
