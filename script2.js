import { WEATHER_API_KEY } from "./secretKeys.js";

let userInput;
let cache = new Map();
let weatherInfo;

// Main application functions

// function searchWeather(location) {}

async function searchWeather(location) {
    try {
        location = normaliseLocation(location);

        const cachedData = checkCache(location);

        if (cachedData) {
            console.log("Using cached data");
            console.log("Updating the display with cached data");
            updateWeatherDisplay(cachedData);
            return cachedData;
        } else {
            console.log("Fetching fresh data");
            const data = await fetchWeatherData(location);

            if (data) {

                console.log("Updating the display with fresh data");
                updateWeatherDisplay(data);

                console.log("Saving fresh data to cache");
                saveToCache(location, data);
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

function checkCache(location) {
    return cache.get(location) || null;
}

function saveToCache(location, data) {
    cache.set(location, data);
    console.log("Cached data for", location);
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

// function processAPIResponse(response) {}

// UI functions

function updateWeatherDisplay(data) {
    weatherInfo = document.getElementById("weatherInfo");

    const tempKelvin = data.main.temp;
    const temp = (tempKelvin - 273.15).toFixed(2);
    const weatherMain = data.weather[0].main;
    const desc = data.weather[0].description;
    const windDirection = data.wind.deg;
    const windSpeed = data.wind.speed;

    weatherInfo.innerHTML = "";

    weatherInfo.innerHTML = `
                <div class="weatherTemp">Temperature: ${temp} Degrees</div>
                <div class="weatherMain">Overview: ${weatherMain}</div>
                <div class="weatherDescription">Description: ${desc}</div>
                <div class="windSpeed">Wind Direction: ${windDirection} Degrees</div>
                <div class="windDirection">Wind Speed: ${windSpeed}Kts</div>
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