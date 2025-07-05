import { WEATHER_API_KEY } from "./secretKeys.js";
import { TIDE_API_KEY } from "./secretKeys.js";

let userInput;
let weatherCache = new Map();
let geoCache = new Map();
let tideCache = new Map();
let weatherInfo;
let cityInfo;
let tideInfo;

// Main application functions

// function searchWeather(location) {}

async function searchWeather(location) {
    try {
        location = normaliseLocation(location);

        const cachedWeather = checkWeatherCache(location);
        const cachedGeo = checkGeoCache(location);

        if (cachedWeather && cachedGeo) {
            console.log("Using cached data");
            console.log("Updating the display with cached data");
            updateWeatherDisplay(cachedWeather, cachedGeo);
            return cachedWeather, cachedGeo;
        } else {
            console.log("Fetching fresh data");
            const weatherData = await fetchWeatherData(location);
            const geoData = await fetchGeoData(location);
            const lat = geoData.results[0].latitude;
            const lon = geoData.results[0].longitude;
            const tideData = await fetchTideData(lat, lon);

            if (weatherData && geoData && tideData) {
                console.log("Updating the display with fresh data");
                updateWeatherDisplay(weatherData, geoData, tideData);

                console.log("Saving fresh data to cache");
                saveToWeatherCache(location, weatherData);
                saveToGeoCache(location, geoData);
                saveToTideCache(location, tideData);
            }
        }
    } catch (error) {
        console.log("There was an error.");
    }
}

window.handleSearch = handleSearch;

// function handleSearch() {}
function handleSearch() {
    userInput = document.getElementById("userInput").value;

    if (!userInput) {
        console.log("Invalid user input");
        return;
    }

    const location = userInput;
    console.log("User input recieved:", location);
    searchWeather(location);
}

// Cache management

// weather cache

function checkWeatherCache(location) {
    return weatherCache.get(location) || null;
}

function saveToWeatherCache(location, weatherData) {
    weatherCache.set(location, weatherData);
    console.log("Cached weather data for", location);
}

// geoData cache

function checkGeoCache(location) {
    return geoCache.get(location) || null;
}

function saveToGeoCache(location, geoData) {
    geoCache.set(location, geoData);
    console.log("Cached geo data for", location);
}

// tideData cache

function checkTideCache(location){
    return tideCache.get(location) || null;
}
function saveToTideCache(location, tideData){
    tideCache.set(location, tideData);
    console.log("Cached tide data for", location);
}

// API functions

async function fetchWeatherData(location) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${WEATHER_API_KEY}`
        );
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.log(error);
    }
}

async function fetchGeoData(location) {
    try {
        console.log("Fetching fresh geo data");
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=10&language=en&format=json`
        );

        if (response.ok) {
            const geoData = await response.json();
            return geoData;
        }
    } catch (error) {
        console.log(error);
    }
}

async function fetchTideData(lat, lon) {
    try {
        console.log("Fetching fresh tide data");
        const response = await fetch(
            `https://api.stormglass.io/v2/tide/extremes/point?lat=${lat}&lng=${lon}`,
            {
                headers: {
                    Authorization: "example_api_keuy",
                },
            }
        );

        if (response.ok) {
            const tideData = await response.json();
            console.log(tideData);
            return tideData;
        }
    } catch (error) {
        console.log(error);
    }
}

// function processAPIResponse(response) {}

// UI functions

function updateWeatherDisplay(data, geoData) {
    weatherInfo = document.getElementById("weatherInfo");
    cityInfo = document.getElementById("cityInfo");
    tideInfo = document.getElementById("tideInfo");

    const tempKelvin = data.main.temp;
    const temp = (tempKelvin - 273.15).toFixed(2);
    const weatherMain = data.weather[0].main;
    const desc = data.weather[0].description;
    const windDirection = data.wind.deg;
    const windSpeed = data.wind.speed;


    const name = geoData.results[0].name;
    const country = geoData.results[0].country_code;
    const latitude = geoData.results[0].latitude;
    const longitude = geoData.results[0].longitude;

    

    weatherInfo.innerHTML = "";

    weatherInfo.innerHTML = `
                <div class="weatherTemp">Temperature: ${temp} Degrees</div>
                <div class="weatherMain">Overview: ${weatherMain}</div>
                <div class="weatherDescription">Description: ${desc}</div>
                <div class="windSpeed">Wind Direction: ${windDirection} Degrees</div>
                <div class="windDirection">Wind Speed: ${windSpeed}Kts</div>
            `;

    cityInfo.innerHTML = "";

    cityInfo.innerHTML = `
                <div class="weatherOverview">${name}, ${country}</div>
                <div class="weatherOverview">Latitude: ${latitude}</div>
                <div class="weatherOverview">Longitude ${longitude}</div>

            `;
    tideInfo.innerHTML = "";

    tideInfo.innerHTML = `

            `;

    console.log("The display has been updated");
}

// function showLoadingState() {}
// function showErrorMessage(error) {}

// Utility functions

function normaliseLocation(location) {
    location = location.toLowerCase().trim();
    console.log("Location is normalized:", location);
    return location;
}
