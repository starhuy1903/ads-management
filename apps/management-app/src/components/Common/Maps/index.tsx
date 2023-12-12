import { Avatar } from '@mui/material';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useCallback, useMemo, useRef, useState } from 'react';
import Map, {
  FullscreenControl,
  GeolocateControl,
  Marker,
  NavigationControl,
  Popup,
  ScaleControl,
} from 'react-map-gl';
import { configs } from '@/configurations';
import SearchBar from './SearchBar';

export default function Maps() {
  const [showPopup, setShowPopup] = useState<boolean>(true);
  const markerRef = useRef<mapboxgl.Marker>();

  // const popup = useMemo(() => {
  //   return mapboxgl.Popup().setText('Hello world!');
  // }, []);

  const togglePopup = useCallback(() => {
    markerRef.current?.togglePopup();
  }, []);

  return (
    <Map
      // mapLib={mapLib}
      initialViewState={{
        longitude: -100,
        latitude: 40,
        zoom: 1,
      }}
      style={{ width: '100%', height: '100%', zIndex: 1 }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={configs.mapBox}
    >
      <FullscreenControl position="bottom-left" />
      <GeolocateControl
        positionOptions={{ enableHighAccuracy: true }}
        trackUserLocation={true}
        position="bottom-left"
      />
      <NavigationControl position="bottom-left" />
      {/* <ScaleControl position="bottom-left" /> */}

      <Marker
        longitude={-100}
        latitude={40}
        anchor="center"
        // popup={popup}
        ref={markerRef}
      >
        <Avatar
          sx={{ bgcolor: 'blue', width: 20, height: 20, fontSize: '12px' }}
          children="BC"
        />
      </Marker>
      <SearchBar />
      {showPopup && (
        <Popup
          longitude={-100}
          latitude={40}
          anchor="top-left"
          onClose={() => setShowPopup(false)}
        >
          You are here
        </Popup>
      )}
    </Map>
  );
}
