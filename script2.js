import { WEATHER_API_KEY } from "./secretKeys.js";
import { TIDE_API_KEY } from "./secretKeys.js";

let userInput;
let selectedDate;
let weatherCache = new Map();
let geoCache = new Map();
let tideCache = new Map();
let weatherInfo;
let cityInfo;
let tideInfo;

// Main application functions

async function searchWeather(location, date) {
    try {
        location = normaliseLocation(location);
        console.log(date);
        const cachedWeather = checkWeatherCache(location);
        const cachedGeo = checkGeoCache(location);
        const cachedTide = checkTideCache(location);

        if (cachedWeather && cachedGeo && cachedTide) {
            showLoadingState("Using cached data");
            console.log("Using cached data");
            showLoadingState("Updating the display with cached data");
            console.log("Updating the display with cached data");
            updateWeatherDisplay(cachedWeather, cachedGeo, cachedTide);
            updateHistoryDisplay(weatherData, geoData, tideData);
            return cachedWeather, cachedGeo, cachedTide;
        } else {
            showLoadingState("Fetching fresh data");
            console.log("Fetching fresh data");
            const geoData = await fetchGeoData(location);
            const lat = geoData.results[0].latitude;
            const lon = geoData.results[0].longitude;
            const weatherData = await fetchWeatherData(lat, lon);
            const tideData = await fetchTideData(lat, lon);

            if (weatherData && geoData && tideData) {
                showLoadingState("Updating the display with fresh data");
                console.log("Updating the display with fresh data");
                updateWeatherDisplay(weatherData, geoData, tideData);

                showLoadingState("Saving fresh data to cache");
                saveToWeatherCache(location, weatherData);
                saveToGeoCache(location, geoData);
                saveToTideCache(location, tideData);
                updateHistoryDisplay();
            }
        }
    } catch (error) {
        showErrorMessage("There was an error in the main function.");
    }
}

// script2.js is a js module. window makes functions() accessible in the browser window
window.handleSearch = handleSearch;
window.clearMessage = clearMessage;

// function handleSearch() {}
function handleSearch() {
    userInput = document.getElementById("userInput").value;
    selectedDate = document.getElementById("dateInput").value;

    if (!userInput) {
        showErrorMessage("Invalid location");
        return;
    }

    if (!selectedDate) {
        showErrorMessage("Invalid date");
        return;
    }

    const location = userInput;
    const date = selectedDate;
    console.log("Location recieved:", location);
    console.log("Date seleccted:", date);
    searchWeather(location, date);
}

// API functions

async function fetchWeatherData(lat, lon) {
    try {
        console.log("Fetching fresh weather data");
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code,cloud_cover,visibility,pressure_msl&past_days=1`
        );
        if (response.ok) {
            const weatherData = await response.json();
            return weatherData;
        }
    } catch (error) {
        showErrorMessage("Couldn't fetch weather data");
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
        showErrorMessage("Couldn't fetch geo data");
    }
}

async function fetchTideData() {
    let tideData = [];

    try {
        console.log("Fetching fresh tide data");
        console.log("In development use a local tide data");
        const response = await fetch("object.json");
        console.log("Local object found");
        if (response.ok) {
            console.log("Response is okay");
            tideData = await response.json();
            console.log("Got the data");
            console.log(tideData.data[0]);
            return tideData;
        } else {
            console.log("The response is not okay");
        }
    } catch (error) {
        showErrorMessage("Couldn't fetch tide data");
    }
}

// UI functions

function updateWeatherDisplay(weatherData, geoData, tideData) {
    weatherInfo = document.getElementById("weatherInfo");
    cityInfo = document.getElementById("cityInfo");
    tideInfo = document.getElementById("tideInfo");

    let temp = weatherData.main.temp;
    temp = normaliseTemp(temp);
    const weatherMain = weatherData.weather[0].main;
    const desc = weatherData.weather[0].description;
    const windDirection = weatherData.wind.deg;
    const windSpeed = weatherData.wind.speed;

    const name = geoData.results[0].name;
    const country = geoData.results[0].country_code;
    const latitude = geoData.results[0].latitude;
    const longitude = geoData.results[0].longitude;

    const type = tideData.data[0].type;
    const time = tideData.data[0].time;


    weatherInfo.innerHTML = "";

    weatherInfo.innerHTML = `
                <div class="info">Temperature: ${temp} Degrees</div>
                <div class="info">Overview: ${weatherMain}</div>
                <div class="info">Description: ${desc}</div>
                <div class="info">Wind Direction: ${windDirection} Degrees</div>
                <div class="info">Wind Speed: ${windSpeed}Kts</div>
            `;

    cityInfo.innerHTML = "";

    cityInfo.innerHTML = `
                <div class="info">${name}, ${country}</div>
                <div class="info">Latitude: ${latitude}</div>
                <div class="info">Longitude ${longitude}</div>

            `;
    tideInfo.innerHTML = "";

    tideInfo.innerHTML = `
                <div class="info">${type} water is at ${time}</div>
            `;

    console.log("The display has been updated");
}

function updateHistoryDisplay() {
    const history = document.getElementById("history");
    history.innerHTML = "";

    // Loop through all cached locations in weatherCache
    for (let [location, weatherData] of weatherCache.entries()) {
        const geoData = geoCache.get(location);
        const tideData = tideCache.get(location);

        // Only proceed if all three caches have data for this location
        if (geoData && tideData) {
            const historyItem = document.createElement("div");
            historyItem.classList.add("info");

            historyItem.innerHTML = `
                <div><strong>${capitaliseLocation(location)}</strong></div>
                <div>Temp: ${normaliseTemp(weatherData.main.temp)}</div>
                <div>Lat: ${geoData.results[0].latitude}</div>
                <div>Tide: ${tideData.data[0].type}</div>
                <div>Tide: ${tideData.data[0].time}</div>
            `;

            history.append(historyItem);
            console.log("The search history has been updated");
        }
    }
}

function showLoadingState(loadingState) {
    const message = document.getElementById("message");
    message.innerHTML = `<div>${loadingState} <button onclick="clearMessage()">X</button></div>`;
}
function showErrorMessage(error) {
    const message = document.getElementById("message");
    message.textContent = error;
}
function clearMessage() {
    const message = document.getElementById("message");
    message.innerHTML = "";
}

// Utility functions

function normaliseLocation(location) {
    location = location.toLowerCase().trim();
    console.log("Location is normalized:", location);
    return location;
}

function capitaliseLocation(location) {
    location = location.charAt(0).toUpperCase() + location.slice(1);
    console.log("Location is capitalised:", location);
    return location;
}

function normaliseTemp(temp) {
    temp = (temp - 273.15).toFixed(2);
    return temp;
}

// Cache management

function checkWeatherCache(location) {
    return weatherCache.get(location) || null;
}
function saveToWeatherCache(location, weatherData) {
    weatherCache.set(location, weatherData);
    console.log("Cached weather data for", location);
}
function checkGeoCache(location) {
    return geoCache.get(location) || null;
}
function saveToGeoCache(location, geoData) {
    geoCache.set(location, geoData);
    console.log("Cached geo data for", location);
}
function checkTideCache(location) {
    return tideCache.get(location) || null;
}
function saveToTideCache(location, tideData) {
    tideCache.set(location, tideData);
    console.log("Cached tide data for", location);
}
