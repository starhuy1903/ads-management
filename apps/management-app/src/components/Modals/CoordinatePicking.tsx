import AddLocationIcon from '@mui/icons-material/AddLocation';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { memo, useEffect, useState } from 'react';
import Map, { Marker } from 'react-map-gl';
import { configs } from '@/configurations';
import { INITIAL_MAP_CENTER } from '@/constants/app';
import GeneralModal from './GeneralModal';

interface CoordinatePickingProps {
  initialCoordinate?: { lat: number; lng: number };
  onPick?: ({ lat, lng }: { lat: number; lng: number }) => void;
  onModalClose: () => void;
  onConfirm: ({ lat, lng }: { lat: number; lng: number }) => void;
  markerIcon: 'new' | 'edit';
}

const CoordinatePicking = ({
  initialCoordinate,
  onPick = () => null,
  onModalClose,
  onConfirm,
  markerIcon = 'new',
}: CoordinatePickingProps) => {
  const [coordinate, setCoordinate] = useState<
    { lat: number; lng: number } | undefined
  >(initialCoordinate);

  useEffect(() => {
    if (coordinate) onPick(coordinate);
  }, [coordinate, onPick]);

  const MarkerIcon = markerIcon === 'new' ? AddLocationIcon : EditLocationIcon;

  const body = (
    <Box sx={{ height: 500, display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          width: '60%',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          marginBottom: '16px',
        }}
      >
        <Typography fontWeight="bolder">Latitude:</Typography>
        <Typography>{coordinate?.lat}</Typography>
        <Typography fontWeight="bolder">Longitude:</Typography>
        <Typography>{coordinate?.lng}</Typography>
      </Box>
      <Box sx={{ width: '100%', flex: 1 }}>
        <Map
          initialViewState={{
            longitude: INITIAL_MAP_CENTER.lng,
            latitude: INITIAL_MAP_CENTER.lat,
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
          onDblClick={(event) => {
            setCoordinate({ lat: event.lngLat.lat, lng: event.lngLat.lng });
          }}
        >
          {coordinate && (
            <Marker
              longitude={coordinate.lng}
              latitude={coordinate.lat}
              style={{ cursor: 'crosshair' }}
            >
              <MarkerIcon
                sx={{
                  color: (theme) => theme.palette.primary.main,
                  transform: 'translateY(-50%)',
                }}
              />
            </Marker>
          )}
        </Map>
      </Box>
    </Box>
  );

  return (
    <GeneralModal
      headerText="Coordinate picking"
      body={body}
      primaryButtonText="Confirm"
      onClickPrimaryButton={() => {
        if (coordinate) onConfirm(coordinate);
      }}
      disabledPrimaryButton={!coordinate}
      onModalClose={onModalClose}
      size="lg"
    />
  );
};

export default memo(CoordinatePicking);
