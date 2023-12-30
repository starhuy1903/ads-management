// import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';
import Map, {
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  Popup,
} from 'react-map-gl';
import { configs } from '@/configurations';
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
