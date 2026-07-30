import './Loader.css';

export default function Loader() {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="loader-circle" />
        <div className="loader-inner" />
      </div>
      <div className="loader-dots">
        <div className="loader-dot" />
        <div className="loader-dot" />
        <div className="loader-dot" />
      </div>
      <p className="loader-text">Fetching weather data...</p>
    </div>
  );
}
