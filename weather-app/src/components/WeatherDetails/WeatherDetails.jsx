import './WeatherDetails.css';

export default function WeatherDetails({ weather, unit }) {
  if (!weather) return null;

  const {
    main: { pressure, sea_level },
    visibility,
    sys: { sunrise, sunset },
    clouds: { all },
  } = weather;

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const details = [
    { icon: 'fa-gauge-high', label: 'Pressure', value: `${pressure} hPa` },
    { icon: 'fa-eye', label: 'Visibility', value: `${(visibility / 1000).toFixed(1)} km` },
    { icon: 'fa-cloud', label: 'Cloudiness', value: `${all}%` },
    { icon: 'fa-sunrise', label: 'Sunrise', value: formatTime(sunrise) },
    { icon: 'fa-sunset', label: 'Sunset', value: formatTime(sunset) },
    { icon: 'fa-water', label: 'Sea Level', value: sea_level ? `${sea_level} hPa` : 'N/A' },
  ];

  return (
    <div className="weather-details-section">
      <h3 className="details-title"><i className="fas fa-circle-info" /> Weather Details</h3>
      <div className="details-grid">
        {details.map((detail, index) => (
          <div className="detail-item" key={detail.label} style={{ animationDelay: `${index * 0.08}s` }}>
            <i className={`fas ${detail.icon}`} />
            <span className="detail-item-label">{detail.label}</span>
            <span className="detail-item-value">{detail.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
