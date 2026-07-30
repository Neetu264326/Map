import { useState, useCallback, useEffect, useMemo } from 'react';
import { useWeather } from './hooks/useWeather';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useGeolocation } from './hooks/useGeolocation';
import SearchBar from './components/SearchBar/SearchBar';
import WeatherCard from './components/WeatherCard/WeatherCard';
import ForecastCard from './components/ForecastCard/ForecastCard';

import WeatherDetails from './components/WeatherDetails/WeatherDetails';
import WeatherMap from './components/WeatherMap/WeatherMap';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import UnitToggle from './components/UnitToggle/UnitToggle';
import Loader from './components/Loader/Loader';
import './App.css';

function RainLayer() {
  const drops = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => ({
      left: `${(i * 1.67) % 100}%`,
      delay: `${(i * 0.15) % 2}s`,
      duration: `${0.6 + (i % 5) * 0.08}s`,
      heavy: i % 7 === 0,
    })),
  []);
  return (
    <div className="rain-layer">
      {drops.map((d, i) => (
        <div
          key={i}
          className={`rain-drop${d.heavy ? ' heavy' : ''}`}
          style={{
            left: d.left,
            height: `${15 + (i % 20)}px`,
            animationDelay: d.delay,
            animationDuration: d.duration,
          }}
        />
      ))}
    </div>
  );
}

function SnowLayer() {
  const flakes = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      left: `${(i * 2) % 100}%`,
      delay: `${(i * 0.3) % 3}s`,
      duration: `${4 + (i % 8) * 0.5}s`,
      size: `${3 + (i % 4)}px`,
    })),
  []);
  return (
    <div className="snow-layer">
      {flakes.map((f, i) => (
        <div
          key={i}
          className="snow-flake"
          style={{
            left: f.left,
            animationDelay: f.delay,
            animationDuration: f.duration,
            width: f.size,
            height: f.size,
          }}
        />
      ))}
    </div>
  );
}

function ThunderLayer() {
  const flashes = useMemo(() =>
    Array.from({ length: 3 }, (_, i) => ({
      x: `${20 + i * 30}%`,
      freq: `${6 + i * 3}s`,
      delay: `${i * 2}s`,
    })),
  []);
  return (
    <>
      <RainLayer />
      <div className="lightning-layer">
        {flashes.map((f, i) => (
          <div
            key={i}
            className="lightning-flash"
            style={{
              '--x': f.x,
              '--freq': f.freq,
              animationDelay: f.delay,
            }}
          />
        ))}
      </div>
    </>
  );
}

function CloudLayer() {
  const clouds = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      top: `${5 + i * 15}%`,
      delay: `${i * 4}s`,
      duration: `${25 + i * 5}s`,
      size: `${80 + i * 40}px`,
      slow: i % 2 === 0,
    })),
  []);
  return (
    <div className="cloud-layer">
      {clouds.map((c, i) => (
        <div
          key={i}
          className={`cloud-puff${c.slow ? ' slow' : ''}`}
          style={{
            top: c.top,
            width: c.size,
            height: parseInt(c.size) * 0.6,
            animationDelay: c.delay,
            animationDuration: c.duration,
            left: `-${100 + i * 50}px`,
          }}
        />
      ))}
    </div>
  );
}

function FogLayer() {
  return (
    <div className="fog-layer">
      <div className="fog-bank" style={{ '--duration': '35s', '--delay': '0s' }} />
      <div className="fog-bank" style={{ '--duration': '45s', '--delay': '10s' }} />
      <div className="fog-bank upper" style={{ '--duration': '50s', '--delay': '5s' }} />
      <div className="fog-bank upper" style={{ '--duration': '40s', '--delay': '20s' }} />
    </div>
  );
}

function SunLayer() {
  const stars = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      top: `${(i * 7.3) % 40}%`,
      left: `${(i * 13.7) % 100}%`,
      delay: `${(i * 0.4) % 3}s`,
      duration: `${2 + (i % 3)}s`,
      size: `${1.5 + (i % 3) * 0.5}px`,
    })),
  []);
  return (
    <>
      <div className="sun-rays-layer" />
      {stars.map((s, i) => (
        <div
          key={i}
          className="star"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        />
      ))}
    </>
  );
}

function WeatherBackgrounds({ condition }) {
  const main = condition?.main?.toLowerCase();
  switch (main) {
    case 'rain':
    case 'drizzle':
      return <RainLayer />;
    case 'thunderstorm':
      return <ThunderLayer />;
    case 'snow':
      return <SnowLayer />;
    case 'clouds':
      return <CloudLayer />;
    case 'mist':
    case 'fog':
    case 'haze':
    case 'smoke':
    case 'dust':
    case 'sand':
    case 'ash':
    case 'squall':
    case 'tornado':
      return <FogLayer />;
    case 'clear':
      return <SunLayer />;
    default:
      return null;
  }
}

export default function App() {
  const { weather, forecast, loading, error, fetchWeather, fetchWeatherByCoords } = useWeather();
  const [lastCity, setLastCity] = useLocalStorage('weather-last-city', '');
  const [unit, setUnit] = useLocalStorage('weather-unit', 'metric');
  const [greeting, setGreeting] = useState('');
  const [geoError, setGeoError] = useState('');
  const { getPosition, loading: geoLoading } = useGeolocation();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  useEffect(() => {
    if (lastCity) {
      fetchWeather(lastCity, unit);
    }
  }, []);

  const handleSearch = useCallback((city) => {
    if (!city.trim()) return;
    setLastCity(city);
    setGeoError('');
    fetchWeather(city, unit);
  }, [fetchWeather, unit, setLastCity]);

  const handleLocationClick = useCallback(async () => {
    try {
      setGeoError('');
      const { lat, lon } = await getPosition();
      setLastCity('');
      fetchWeatherByCoords(lat, lon, unit);
    } catch (err) {
      setGeoError(err.message);
    }
  }, [getPosition, fetchWeatherByCoords, unit, setLastCity]);

  const handleMapClick = useCallback((lat, lon) => {
    setLastCity('');
    setGeoError('');
    fetchWeatherByCoords(lat, lon, unit);
  }, [fetchWeatherByCoords, unit, setLastCity]);

  const handleUnitToggle = useCallback((newUnit) => {
    setUnit(newUnit);
    if (weather) {
      const cityName = lastCity || weather.name;
      fetchWeather(cityName, newUnit);
    }
  }, [weather, lastCity, fetchWeather, setUnit]);

  const bgClass = weather
    ? `app-bg-${weather.weather[0].main.toLowerCase()}`
    : 'app-bg-default';

  const particles = useMemo(() => [
    { w: 4, h: 4, t: '15%', l: '10%', d: '0s', dur: '7s' },
    { w: 6, h: 6, t: '30%', l: '85%', d: '1s', dur: '9s' },
    { w: 3, h: 3, t: '60%', l: '20%', d: '2s', dur: '6s' },
    { w: 5, h: 5, t: '75%', l: '75%', d: '0.5s', dur: '8s' },
    { w: 4, h: 4, t: '45%', l: '50%', d: '3s', dur: '10s' },
  ], []);

  return (
    <div className={`app ${bgClass}`}>
      <div className="app-overlay" />
      <div className="app-bg-particles">
        {particles.map((p, i) => (
          <div key={i} className="particle" style={{ width: p.w, height: p.h, top: p.t, left: p.l, animationDelay: p.d, animationDuration: p.dur }} />
        ))}
      </div>
      {weather && !loading && <WeatherBackgrounds condition={weather.weather[0]} />}
      <WeatherMap
        weather={weather}
        coords={weather?.coord}
        cityName={weather ? `${weather.name}, ${weather.sys.country}` : ''}
        onMapClick={handleMapClick}
      />
      <ThemeToggle />
      <UnitToggle unit={unit} onToggle={handleUnitToggle} />

      <header className="app-header">
        <div className="app-brand">
          <div className="app-brand-icon-wrap">
            <div className="app-brand-icon-glow" />
            <i className="fas fa-cloud-sun" />
          </div>
          <h1>WeatherWise</h1>
        </div>
        <p className="app-greeting">{greeting}</p>
      </header>

      <main className="app-main">
        <SearchBar
          onSearch={handleSearch}
          onLocationClick={handleLocationClick}
          loading={loading || geoLoading}
        />

        {geoError && <div className="error-message"><i className="fas fa-circle-exclamation" /> {geoError}</div>}

        {loading && <Loader />}

        {error && !loading && (
          <div className="error-card">
            <i className="fas fa-triangle-exclamation" />
            <p>{error}</p>
          </div>
        )}

        {weather && !loading && !error && (
          <div className="weather-content">
            <div className="weather-info-col">
              <WeatherCard weather={weather} unit={unit} />
              <WeatherDetails weather={weather} unit={unit} />
              <ForecastCard forecast={forecast} unit={unit} />
            </div>
          </div>
        )}

        {!weather && !loading && !error && !geoError && (
          <div className="empty-state">
            <div className="empty-state-icon-wrap">
              <div className="empty-state-icon-glow" />
              <i className="fas fa-magnifying-glass" />
            </div>
            <h2>Search for a city</h2>
            <p>Enter a city name above or use your location to get started.</p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p><i className="fas fa-cloud" /> Powered by WeatherAPI.com</p>
      </footer>
    </div>
  );
}
