import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [photo, setPhoto] = useState("");

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8080/weather?city=${city}`
      );
      const data = response.data;
      if (!data) {
        setErrorMessage("Error Occurred");
      } else if (data.message && data.message === "city not found") {
        setErrorMessage("City not found");
      } else {
        setWeatherData(data);
        setErrorMessage("");
        fetchCityPhoto(city);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setErrorMessage("Error Occurred");
    }
  };

  const fetchCityPhoto = async (city) => {
    try {
      const accessKey = "add yours here";
      const response = await axios.get(
        `https://api.unsplash.com/search/photos?page=1&query=${city}&client_id=${accessKey}`
      );
      const data = response.data;
      if (data && data.results && data.results.length > 0) {
        setPhoto(data.results[0].urls.regular);
      } else {
        setPhoto("");
      }
    } catch (error) {
      console.error("Error fetching city photo:", error);
      setPhoto("");
    }
  };

  useEffect(() => {
    if (city !== "") {
      fetchWeatherData();
    }
  }, [city]);

  return (
    <div className="container">
      <div className="Outer-card">
        <h1 className="title">Weather App</h1>
        <div className="input-container">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            className="input"
          />
          <button onClick={fetchWeatherData} className="button">
            Get Weather
          </button>
        </div>
        <br></br>

        {weatherData && !errorMessage && (
          <div className="card">
            <div className="upper-part">
              <div className="image-section">
                {photo && <img src={photo} alt="City" className="city-image" />}
              </div>
              <div className="weather-icon">
                {weatherData && (
                  <img src={weatherData.weather.icon} alt="Weather Icon" />
                )}
              </div>
              <div className="description">
                {weatherData && <p>{weatherData.weather.description}</p>}
              </div>
            </div>
            {/* <hr /> */}
            <div className="lower-part">
              <div className="temperature">
              {weatherData && <h2>{Math.round(weatherData.weather.temperature - 273.15)}°C</h2>}
              </div>
              <div className="city-name">
                {weatherData && <p>{weatherData.location}</p>}
              </div>
              <div className="humidity">
                {weatherData && (
                  <p>Humidity: {weatherData.weather.humidity}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
}

export default App;
