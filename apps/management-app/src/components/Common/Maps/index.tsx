import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { GeolocateControl } from 'react-map-gl';
import SearchBar from './SearchBar';

export default function Maps() {
  return (
    <Map
      mapLib={import('mapbox-gl')}
      initialViewState={{
        longitude: -100,
        latitude: 40,
        zoom: 1,
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken="pk.eyJ1Ijoic3Rhcmh1eTE5MDMiLCJhIjoiY2xwcXV6bmNnMDE0ejJqbzE3YWNqd3ViMCJ9.mWC4Rz_t-lMCPakGKCZtyQ"
      // mapboxAccessToken={import.meta.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
    >
      <GeolocateControl
        positionOptions={{ enableHighAccuracy: true }}
        trackUserLocation={true}
        position="bottom-left"
      />
      <SearchBar />
    </Map>
  );
}
