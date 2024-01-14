import AddLocationIcon from '@mui/icons-material/AddLocation';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { memo, useEffect, useState } from 'react';
import Map, { FullscreenControl, Marker } from 'react-map-gl';
import { configs } from '@/configurations';
import { INITIAL_MAP_CENTER } from '@/constants/app';
import GeocoderControl from '../Common/Maps/GeocoderControl';
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
    <Box sx={{ height: '60dvh', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
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
            longitude: initialCoordinate?.lng || INITIAL_MAP_CENTER.lng,
            latitude: initialCoordinate?.lat || INITIAL_MAP_CENTER.lat,
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
          <GeocoderControl
            mapboxAccessToken={configs.mapBox}
            position="top-left"
          />
          <FullscreenControl position="bottom-right" />
          {coordinate && (
            <Marker
              draggable
              onDragEnd={(event) =>
                setCoordinate({ lat: event.lngLat.lat, lng: event.lngLat.lng })
              }
              longitude={coordinate.lng}
              latitude={coordinate.lat}
              style={{ cursor: 'pointer' }}
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
