import { useState, useCallback } from 'react';
import { getCurrentWeather, getCurrentWeatherByCoords } from '../api/weatherApi';

export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async (city, units = 'metric') => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCurrentWeather(city, units);
      setWeather(data);
      setForecast(data._forecast || []);
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeatherByCoords = useCallback(async (lat, lon, units = 'metric') => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCurrentWeatherByCoords(lat, lon, units);
      setWeather(data);
      setForecast(data._forecast || []);
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { weather, forecast, loading, error, fetchWeather, fetchWeatherByCoords };
}
