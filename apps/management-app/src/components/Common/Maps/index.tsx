import { Avatar } from '@mui/material';
// import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import Map, {
  FullscreenControl,
  GeolocateControl,
  Marker,
  NavigationControl,
  Popup,
} from 'react-map-gl';
import { configs } from '@/configurations';
import { useAppDispatch } from '@/store';
import { SidebarKey } from '@/constants/sidebar';
import { showSidebar } from '@/store/slice/sidebar';
import CenterLoading from '../CenterLoading';

interface ViewPort {
  zoom: number;
  latitude: number;
  longitude: number;
}

export default function Maps({ children }: { children?: React.ReactNode }) {
  const [viewPort, setViewPort] = useState<ViewPort>();
  const [showPopup, setShowPopup] = useState<boolean>(true);

  const markerRef = useRef<mapboxgl.Marker>();
  const dispatch = useAppDispatch();

  const handleViewDetailAd = useCallback(() => {
    dispatch(
      showSidebar(SidebarKey.AD_DETAIL, {
        sidebarId: 1, // todo: remove mock
      }),
    );
  }, [dispatch]);

  // const popup = useMemo(() => {
  //   return mapboxgl.Popup().setText('Hello world!');
  // }, []);

  // const togglePopup = useCallback(() => {
  //   markerRef.current?.togglePopup();
  // }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setViewPort({
        zoom: 15,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    });
  }, []);

  if (!viewPort) {
    return <CenterLoading />;
  }

  return (
    <Map
      initialViewState={viewPort}
      // mapLib={mapLib}
      style={{ width: '100%', height: '100%', zIndex: 1 }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={configs.mapBox}
      logoPosition="bottom-right"
    >
      <FullscreenControl position="bottom-right" />
      <GeolocateControl
        positionOptions={{ enableHighAccuracy: true }}
        trackUserLocation={true}
        position="bottom-right"
      />
      <NavigationControl position="bottom-right" />
      {/* <ScaleControl position="bottom-left" /> */}
      {children}
      <Marker
        longitude={-100}
        latitude={40}
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
