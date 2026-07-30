import './ForecastCard.css';

export default function ForecastCard({ forecast, unit }) {
  if (!forecast || forecast.length === 0) return null;

  const unitSymbol = unit === 'metric' ? '°C' : '°F';

  return (
    <div className="forecast-section">
      <h3 className="forecast-title"><i className="fas fa-calendar-week" /> 14-Day Forecast</h3>
      <div className="forecast-grid">
        {forecast.map((day, index) => {
          const date = new Date(day.dt * 1000);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          const iconUrl = day.weather[0].icon.startsWith('//') ? `https:${day.weather[0].icon}` : day.weather[0].icon;

          return (
            <div className="forecast-item" key={day.dt} style={{ animationDelay: `${index * 0.1}s` }}>
              <span className="forecast-day">{dayName}</span>
              <img className="forecast-icon" src={iconUrl} alt={day.weather[0].description} loading="lazy" />
              <span className="forecast-temp">{Math.round(day.main.temp)}{unitSymbol}</span>
              <span className="forecast-desc">{day.weather[0].main}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
