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
      setForecast([]);
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
      setForecast([]);
      return;
    }

    setWeather(data);
    setError("");
  };
 
  const handleSearch = async () => {

    if (!city.trim()) {
      setError("Please enter a city.");
      setWeather(null);
      setForecast([]);
      return;
    }
    
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

        const weatherUrl = 
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      
      const forecastUrl =
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

      
        await fetchWeather(weatherUrl)
        await fetchForecast(forecastUrl)
        setError("");
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
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Real Feel: {weather.main.feels_like}°C</p>

        </div>
      )}

      {forecast.length > 0 && (
        <div>
          <h2>5 Day Forecast</h2>

          {forecast.map((day) => (
            <div key={day.dt}>
              <p>
                {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </p>
              <p>{day.main.temp}°C</p>
              <p>{day.weather[0].description}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default App;