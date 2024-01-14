import AddLocationIcon from '@mui/icons-material/AddLocation';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { memo, useEffect, useState } from 'react';
import Map, { FullscreenControl, Marker } from 'react-map-gl';
import { configs } from '@/configurations';
import { INITIAL_MAP_CENTER } from '@/constants/app';
import { useLazyGetLocationsQuery } from '@/store/api/cdo/adsManagementApiSlice';
import { LocationFull } from '@/types/cdoManagement';
import GeocoderControl from '../Common/Maps/GeocoderControl';
import GeneralModal from './GeneralModal';

interface LocationPickingProps {
  initialLocation?: number;
  onPick?: (id: number) => void;
  onModalClose: () => void;
  onConfirm: (id: number) => void;
}

const LocationPicking = ({
  initialLocation,
  onPick = () => null,
  onModalClose,
  onConfirm,
}: LocationPickingProps) => {
  const [getLocations, { data: locations }] = useLazyGetLocationsQuery();

  const [location, setLocation] = useState<LocationFull | undefined | null>();

  useEffect(() => {
    const fetch = async () => {
      const getLocationsResult = await getLocations(
        { districts: [], wards: [] },
        true,
      ).unwrap();
      setLocation(
        initialLocation
          ? getLocationsResult.data.find((e) => e.id === initialLocation)
          : null,
      );
    };
    fetch();
  }, [getLocations, initialLocation]);

  useEffect(() => {
    if (location) onPick(location.id);
  }, [location, onPick]);

  const body = (
    <Box
      sx={{
        height: 300,
        display: 'grid',
        gridTemplateColumns: '4fr 1fr',
        gap: '10px',
      }}
    >
      <Box>
        {location !== undefined && (
          <Map
            initialViewState={{
              longitude: location ? location.long : INITIAL_MAP_CENTER.lng,
              latitude: location ? location.lat : INITIAL_MAP_CENTER.lat,
              zoom: 15,
            }}
            cursor="crosshair"
            style={{
              width: '100%',
              height: '100%',
              zIndex: 1,
            }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxAccessToken={configs.mapBox}
            logoPosition="bottom-right"
            doubleClickZoom={false}
          >
            <GeocoderControl
              mapboxAccessToken={configs.mapBox}
              position="top-left"
            />
            <FullscreenControl position="bottom-right" />
            {locations &&
              locations.data.map((e) => (
                <Marker
                  longitude={e.long}
                  latitude={e.lat}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setLocation(e)}
                >
                  {e === location ? (
                    <AddLocationIcon
                      sx={{
                        color: (theme) => theme.palette.primary.main,
                        transform: 'scale(1.3) translateY(-50%)',
                        transition: 'all 0.5s ease',
                      }}
                    />
                  ) : (
                    <LocationOnIcon
                      sx={{
                        color: (theme) => theme.palette.primary.main,
                        transform: 'translateY(-50%)',
                        transition: 'all 0.5s ease',

                        '&:hover': {
                          transform: 'scale(1.3) translateY(-50%)',
                        },
                      }}
                    />
                  )}
                </Marker>
              ))}
          </Map>
        )}
      </Box>
      {location && (
        <Stack
          direction="column"
          gap={1}
          sx={{
            maxHeight: '100%',
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
              padding: '0px 2px',
            },

            '&::-webkit-scrollbar-track': {
              backgroundColor: (theme) => theme.palette.grey[200],
            },

            '&::-webkit-scrollbar-thumb': {
              border: '2px solid transparent',
              borderRadius: '4px',
              backgroundClip: 'padding-box',
              backgroundColor: (theme) => theme.palette.primary.main,
            },

            '&::-webkit-scrollbar-track-piece': {
              borderColor: 'transparent',
              backgroundColor: 'transparent',
            },
          }}
        >
          <Typography fontWeight="bold">Name:</Typography>
          <Typography>{location.name}</Typography>
          <Typography fontWeight="bold">Full address:</Typography>
          <Typography>{location.fullAddress}</Typography>
          <Typography fontWeight="bold">Planning state:</Typography>
          <Typography>
            {location.isPlanning ? 'Planning' : 'Not planning'}
          </Typography>
          <Typography fontWeight="bold">District:</Typography>
          <Typography>{location.district.name}</Typography>
          <Typography fontWeight="bold">Ward:</Typography>
          <Typography>{location.ward.name}</Typography>
          <Typography fontWeight="bold">Type:</Typography>
          <Typography>{location.type.name}</Typography>
          <Typography fontWeight="bold">Advertisement type:</Typography>
          <Typography>{location.adType.name}</Typography>
          <Typography fontWeight="bold">Images:</Typography>
          {location.imageUrls.length > 0 ? (
            location.imageUrls.map((e) => <img src={e} alt="alt" />)
          ) : (
            <Typography>None</Typography>
          )}
        </Stack>
      )}
    </Box>
  );

  return (
    <GeneralModal
      headerText="Location picking"
      body={body}
      primaryButtonText="Confirm"
      onClickPrimaryButton={() => {
        if (location) onConfirm(location.id);
      }}
      disabledPrimaryButton={!location}
      onModalClose={onModalClose}
      size="lg"
    />
  );
};

export default memo(LocationPicking);
