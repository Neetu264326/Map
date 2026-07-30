import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import './WeatherMap.css';

function MapController({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView([coords.lat, coords.lon], 10, { animate: true });
    }
  }, [coords, map]);
  return null;
}

function ClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onMapClick?.(lat, lng);
    },
  });
  return null;
}

export default function WeatherMap({ weather, coords, cityName, onMapClick }) {
  const center = coords ? [coords.lat, coords.lon] : [20, 0];
  const zoom = coords ? 10 : 2;

  return (
    <div className="weather-map-container">
      <MapContainer
        center={center}
        zoom={zoom}
        className="weather-map"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController coords={coords} />
        <ClickHandler onMapClick={onMapClick} />
        {coords && (
          <>
            <CircleMarker
              center={[coords.lat, coords.lon]}
              pathOptions={{
                color: 'transparent',
                fillColor: '#6366f1',
                fillOpacity: 0.12,
                weight: 1,
              }}
              radius={60}
            />
            <CircleMarker
              center={[coords.lat, coords.lon]}
              pathOptions={{
                color: 'transparent',
                fillColor: '#6366f1',
                fillOpacity: 0.25,
                weight: 1,
              }}
              radius={35}
            />
            <CircleMarker
              center={[coords.lat, coords.lon]}
              pathOptions={{
                color: '#ffffff',
                fillColor: '#6366f1',
                fillOpacity: 0.9,
                weight: 3,
              }}
              radius={10}
            >
              <Popup>
                <div className="map-popup">
                  <strong>{cityName}</strong>
                  {weather && (
                    <p>{Math.round(weather.main.temp)}°C — {weather.weather[0].description}</p>
                  )}
                </div>
              </Popup>
              <Tooltip direction="top" offset={[0, -12]} permanent>
                <span className="map-tooltip-label">{cityName}</span>
              </Tooltip>
            </CircleMarker>
          </>
        )}
      </MapContainer>
    </div>
  );
}
