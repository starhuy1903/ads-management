// import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';
import Map, {
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
} from 'react-map-gl';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { configs } from '@/configurations';
import CenterLoading from '../CenterLoading';
import GeocoderControl from './GeocoderControl';

interface ViewPort {
  zoom: number;
  latitude: number;
  longitude: number;
}

interface MapsProps {
  selectedViewPort?: ViewPort;
  children?: React.ReactNode;
}

export default function Maps({ selectedViewPort, children }: MapsProps) {
  const [viewPort, setViewPort] = useState<ViewPort>();
  const markerRef = useRef<mapboxgl.Marker>();

  // const popup = useMemo(() => {
  //   return mapboxgl.Popup().setText('Hello world!');
  // }, []);

  // const togglePopup = useCallback(() => {
  //   markerRef.current?.togglePopup();
  // }, []);

  useEffect(() => {
    if (selectedViewPort) {
      setViewPort(selectedViewPort);
    } else {
      navigator.geolocation.getCurrentPosition((pos) => {
        setViewPort({
          zoom: 15,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      });
    }
  }, [selectedViewPort]);

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
      <GeocoderControl mapboxAccessToken={configs.mapBox} position="top-left" />
      <FullscreenControl position="bottom-right" />
      <GeolocateControl
        positionOptions={{ enableHighAccuracy: true }}
        trackUserLocation={true}
        position="bottom-right"
      />
      <NavigationControl position="bottom-right" />
      {/* <ScaleControl position="bottom-left" /> */}
      {children}
    </Map>
  );
}
