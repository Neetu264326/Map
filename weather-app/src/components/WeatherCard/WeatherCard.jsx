import './WeatherCard.css';

export default function WeatherCard({ weather, unit }) {
  if (!weather) return null;

  const {
    name,
    sys: { country },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    weather: [desc],
    wind: { speed },
  } = weather;

  const iconUrl = desc.icon.startsWith('//') ? `https:${desc.icon}` : desc.icon;
  const unitSymbol = unit === 'metric' ? '°C' : '°F';
  const windUnit = unit === 'metric' ? 'km/h' : 'mph';

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="weather-card">
      <div className="weather-main">
        <div className="weather-location">
          <h2 className="weather-city">
            {name}, <span className="weather-country">{country}</span>
          </h2>
          <p className="weather-date"><i className="fas fa-calendar-alt" /> {dateStr}</p>
          <p className="weather-time"><i className="fas fa-clock" /> {timeStr}</p>
        </div>
        <div className="weather-temp-section">
          <div className="weather-icon-wrap">
            <div className="weather-icon-glow" />
            <img
              className="weather-icon"
              src={iconUrl}
              alt={desc.description}
              loading="lazy"
            />
          </div>
          <div className="weather-temp">
            <span className="weather-temp-value">{Math.round(temp)}</span>
            <span className="weather-temp-unit">{unitSymbol}</span>
          </div>
          <p className="weather-condition">{desc.description}</p>
          <p className="weather-feels">
            <i className="fas fa-temperature-low" /> Feels like {Math.round(feels_like)}{unitSymbol}
          </p>
        </div>
      </div>
      <div className="weather-details-grid">
        <div className="detail-card">
          <i className="fas fa-droplet detail-icon" />
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{humidity}%</span>
        </div>
        <div className="detail-card">
          <i className="fas fa-wind detail-icon" />
          <span className="detail-label">Wind Speed</span>
          <span className="detail-value">{speed} {windUnit}</span>
        </div>
        <div className="detail-card">
          <i className="fas fa-temperature-high detail-icon" />
          <span className="detail-label">Max Temp</span>
          <span className="detail-value">{Math.round(temp_max)}{unitSymbol}</span>
        </div>
        <div className="detail-card">
          <i className="fas fa-temperature-low detail-icon" />
          <span className="detail-label">Min Temp</span>
          <span className="detail-value">{Math.round(temp_min)}{unitSymbol}</span>
        </div>
      </div>
    </div>
  );
}
