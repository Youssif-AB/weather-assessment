import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [forecast, setForecast] = useState([]);

  const fetchForecast = async (url) => {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return;   
    }

    const dailyForecast = data.list.filter((item, index) => {
        return index % 8 === 0;
    });
    
    setForecast(dailyForecast)
  }

  const fetchWeather = async (url) => {
    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      setError(data.message);
      setWeather(null);
      return;
    }

    setWeather(data);
    setError("");
  };
 
  const handleSearch = async () => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    const weatherUrl = 
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const forecastUrl =
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;



    await fetchWeather(weatherUrl)
    await fetchForecast(forecastUrl)
  };

  const handleCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const url = 
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      
        await fetchWeather(url)
      },

      () => {
        setError("Unable to get your current location.");
      }
    );
  };



  return (
    <main>
      <h1>Weather App</h1>

      <div>
        <input type="text"
        placeholder="Enter a city"
        value={city}
        onChange={(event) => setCity(event.target.value)}
        />

        <button onClick={handleSearch}> Search</button>

        <button onClick={handleCurrentLocation}> Use My Location</button>
        {error && <p>{error}</p>}
      </div>

      <p>You typed: {city}</p>

      {weather && (
        <div>
          <h2>{weather.name}</h2>
          <h3>{weather.weather[0].description}</h3>
          <p>Temperature: {weather.main.temp}C</p>
          <p>Real Feel: {weather.main.feels_like}</p>

        </div>
      )}

      {forecast.length > 0 && (
        <div>
          <h2>5 Day Forecast</h2>

          {forecast.map((day) => (
            <div key={day.dt}>
              <p>{day.dt}</p>
              <p>{day.main.temp}</p>
              <p>{day.weather[0].description}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default App;