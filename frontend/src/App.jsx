import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [forecast, setForecast] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  const updateSearch = async (search) => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    const weatherURL = 
    `https://api.openweathermap.org/data/2.5/weather?q=${search.location}&appid=${apiKey}&units=metric`;

    const respone = await fetch(weatherURL);
    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Could not refresh this saved search.");
      return;
    }

    await fetch(`http://localhost:5000/api/searches/${search.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        location: search.location,
        temperature: data.main.temp,
        description: data.weather[0].description,
      }),
    });

    setError("");
    fetchSearchHistory();
  }

  const exportSearches = () => {
    window.location.href = "http://localhost:5000/api/export/json";
  };

  const deleteSearch = async (id) => {
    await fetch(`http://localhost:5000/api/searches/${id}`, {
      method: 'DELETE'
    });

    fetchSearchHistory();
  }

  const fetchSearchHistory = async () => {
    const response = await fetch("http://localhost:5000/api/searches");
    const data = await response.json();

    setSearchHistory(data);
  }


  const saveSearch = async (weatherData) => {
    await fetch("http://localhost:5000/api/searches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        location: weatherData.name,
        temperature: weatherData.main.temp,
        description: weatherData.weather[0].description,
      }),
    });
  };

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
    await saveSearch(data);
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

        <button onClick={fetchSearchHistory}>Load Search History</button>

        <button onClick={exportSearches}>Export Searches</button>
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

      {searchHistory.length > 0 && (
        <div>
          <h2>Search History</h2>

          {searchHistory.map((search) => (
            <div key={search.id}>
              <p>{search.location}</p>
              <p>{search.temperature}</p>
              <p>{search.description}</p>
              <button onClick={() => deleteSearch(search.id)}>Delete</button>
              <button onClick={() => updateSearch(search)}>Refresh Weather</button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default App;