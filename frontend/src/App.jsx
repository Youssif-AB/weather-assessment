import { useState } from "react";

function App() {
  const [city, setCity] = useState("");

  const handleSearch = () => {
  console.log("Searching for:", city)
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
    </main>
  );
}

export default App;