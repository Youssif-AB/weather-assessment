<img width="2041" height="1499" alt="image" src="https://github.com/user-attachments/assets/cf5d3d74-0fb4-422e-a06f-7c7633da121b" />

# Weather App Technical Assessment

Built by Youssif Abdelaziz

## What was built

A full stack weather application allowing users to search for weather in real time using any given city or current geolocation.

The app displays the current weather, a 5 day forecast, weather icons for enhanced UI, Google maps API integration, and error handling for invalid requests.

The backend is able to store our successful weather searches in a database using SQLite and allows for full CRUD operationality.
Users are able to view their weather data, delete their records, refresh and update the data, export saved searches as JSON.

## Tech Stack

- React + Vite
- Node.js + Express
- SQLite
- OpenWeather API

## How To Run

### Backend

```bash
cd backend
npm install
npm run dev
```
The backend runs on:

http://localhost:5000


### Frontend

```bash
cd frontend
npm install
npm run dev
```

Create a frontend/.env file:

VITE_WEATHER_API_KEY=your_openweather_api_key_here

The frontend runs on:

http://localhost:5173
