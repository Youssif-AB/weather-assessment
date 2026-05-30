import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
 
  const handleSearch = async () => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    const url = 
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    console.log(url)

    const response = await fetch(url)
    const data = await response.json();

    if (!response.ok) {
      setError(data.message);
      setWeather(null)
      return;
    }

    console.log(data)
    setWeather(data)
    setError("")
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
    </main>
  );
}

export default App;