// import mapboxgl from 'mapbox-gl';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useCallback, useEffect, useState } from 'react';
import Map, {
  FullscreenControl,
  GeolocateControl,
  Marker,
  NavigationControl,
} from 'react-map-gl';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { configs } from '@/configurations';
import { useAppDispatch } from '@/store';
import { SidebarKey } from '@/constants/sidebar';
import { showSidebar } from '@/store/slice/sidebar';
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
  onClearSelectedLocation?: () => void;
}

export default function Maps({
  selectedViewPort,
  children,
  onClearSelectedLocation,
}: MapsProps) {
  const [viewPort, setViewPort] = useState<ViewPort>();

  const [marker, setMarker] = useState({ latitude: 0, longitude: 0 });
  const dispatch = useAppDispatch();

  const onClickAnyPoint = useCallback(
    async (event: mapboxgl.MapLayerMouseEvent) => {
      onClearSelectedLocation?.();

      setMarker({
        latitude: event.lngLat.lat,
        longitude: event.lngLat.lng,
      });

      const response = await mbxGeocoding({ accessToken: configs.mapBox })
        .reverseGeocode({
          query: [event.lngLat.lng, event.lngLat.lat],
        })
        .send();

      const address = response.body.features[0].place_name;
      dispatch(
        showSidebar(SidebarKey.ANY_POINT, {
          address,
        }),
      );
    },
    [onClearSelectedLocation, dispatch],
  );

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
      onClick={onClickAnyPoint}
    >
      <Marker latitude={marker.latitude} longitude={marker.longitude}>
        <div>📍</div>
      </Marker>

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
