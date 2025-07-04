let userInput;
let cache = [];
let lcache = null;

// Main application functions

// function searchWeather(location) {}

async function searchWeather(location) {
    
    // trim and lower case
    location = normaliseLocation(location);
    console.log("Location is normalized: ", location);

    // check if cache
    cache = checkCache(location);

    if (cache) {
        updateWeatherDisplay(data);
    } else {
        const data = await fetchWeatherData(location);
        saveToCache(location, data);
        return
    }

    console.log("Fetching weather data");
    const data = await fetchWeatherData(location);
    console.log(data);

    console.log("Saving data to cache");
    saveToCache(location, data);
}

// function handleSearch() {}
function handleSearch() {
    userInput = document.getElementById("userInput").value;
    const location = userInput;
    console.log("User input recieved: ", location);
    searchWeather(location);
}

// Cache management

function checkCache(location) {
    return cache;
}

function saveToCache(location, data) {
    lcache = location;
    cache = data;
    console.log(lcache, cache);
    return lcache, cache;
}

// API functions

// async function fetchWeatherData(location) {}
async function fetchWeatherData(location) {
    const APIKey = "83cf14a6a2dd86474328a3acb4585de5";

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${APIKey}`
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

// function updateWeatherDisplay(data) {}
// function showLoadingState() {}
// function showErrorMessage(error) {}

// Utility functions

function normaliseLocation(location) {
    return location.toLowerCase().trim();
}
// function formatTemperature(temp) {}
