const API_KEY = 'b4c6efe230a84cb4b2b175243262807';
const BASE_URL = '/api';

async function fetchData(endpoint, params) {
  const query = new URLSearchParams({ key: API_KEY, ...params }).toString();
  const response = await fetch(`${BASE_URL}/${endpoint}?${query}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.error?.message || response.statusText;
    if (response.status === 400) throw new Error(`City not found. Please check the spelling.`);
    if (response.status === 401 || response.status === 403) throw new Error(`Invalid API key.`);
    throw new Error(message || `Failed to fetch weather data.`);
  }
  const data = await response.json();
  return data;
}

function normalizeCurrent(data) {
  const loc = data.location;
  const cur = data.current;
  const day = data.forecast?.forecastday?.[0];
  const astro = day?.astro;

  const parseTimeToEpoch = (timeStr, dateEpoch) => {
    if (!timeStr || !dateEpoch) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    const isPM = timeStr.includes('PM');
    const hours = isPM && h !== 12 ? h + 12 : !isPM && h === 12 ? 0 : h;
    const date = new Date(dateEpoch * 1000);
    date.setHours(hours, m, 0, 0);
    return Math.floor(date.getTime() / 1000);
  };

  return {
    name: loc.name,
    coord: { lat: loc.lat, lon: loc.lon },
    dt: cur.last_updated_epoch || Math.floor(Date.now() / 1000),
    sys: {
      country: loc.country,
      sunrise: parseTimeToEpoch(astro?.sunrise, loc.localtime_epoch),
      sunset: parseTimeToEpoch(astro?.sunset, loc.localtime_epoch),
    },
    main: {
      temp: cur.temp_c,
      feels_like: cur.feelslike_c,
      temp_min: day?.day?.mintemp_c || cur.temp_c,
      temp_max: day?.day?.maxtemp_c || cur.temp_c,
      humidity: cur.humidity,
      pressure: cur.pressure_mb,
      sea_level: cur.pressure_mb,
    },
    visibility: (cur.vis_km || 10) * 1000,
    weather: [{
      id: cur.condition.code,
      main: cur.condition.text,
      description: cur.condition.text,
      icon: cur.condition.icon,
    }],
    clouds: { all: cur.cloud },
    wind: { speed: cur.wind_kph },
  };
}

function normalizeForecast(data) {
  if (!data.forecast?.forecastday) return [];
  return data.forecast.forecastday.map((day) => ({
    dt: new Date(day.date).getTime() / 1000,
    main: {
      temp: day.day.avgtemp_c,
      temp_min: day.day.mintemp_c,
      temp_max: day.day.maxtemp_c,
      humidity: day.day.avghumidity,
    },
    weather: [{
      main: day.day.condition.text,
      description: day.day.condition.text,
      icon: day.day.condition.icon,
    }],
  }));
}

export async function getCurrentWeather(city, units = 'metric') {
  const endpoint = 'forecast.json';
  const data = await fetchData(endpoint, { q: city, days: 14 });
  return { ...normalizeCurrent(data), _forecast: normalizeForecast(data) };
}

export async function getCurrentWeatherByCoords(lat, lon, units = 'metric') {
  const endpoint = 'forecast.json';
  const data = await fetchData(endpoint, { q: `${lat},${lon}`, days: 14 });
  return { ...normalizeCurrent(data), _forecast: normalizeForecast(data) };
}

export async function getForecast(city, units = 'metric') {
  const endpoint = 'forecast.json';
  const data = await fetchData(endpoint, { q: city, days: 14 });
  return { list: normalizeForecast(data) };
}

export async function getForecastByCoords(lat, lon, units = 'metric') {
  const endpoint = 'forecast.json';
  const data = await fetchData(endpoint, { q: `${lat},${lon}`, days: 14 });
  return { list: normalizeForecast(data) };
}
