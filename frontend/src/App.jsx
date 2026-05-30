import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  const handleSearch = async () => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    const url = 
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    console.log(url)

    const response = await fetch(url)
    const data = await response.json();

    console.log(data)
    setWeather(data)
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
      </div>

      <p>You typed: {city}</p>

      {weather && (
        <div>
          <h2>{weather.name}</h2>
          <p>Temperature: {weather.main.temp}C</p>
        </div>
      )}
    </main>
  );
}

export default App;