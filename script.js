let weatherCache;
let weatherCacheTime;
let geoCache;
let geoCacheTime;
const CACHE_DURATION = 10 * 60 * 1000; // ten minutes

document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        getWeather();
        getGeoCode();
    }
});

const weatherInfo = document.getElementById("weatherInfo");

// function to get weather forecast based on user inputting city name
async function getWeather() {
    const cityName = document.getElementById("userInput").value;
    const APIKey = "83cf14a6a2dd86474328a3acb4585de5";

    // check if we have data already cached
    if (weatherCache && weatherCacheTime) {

        // check if that cacheAge < CACHE_DURATION
        const now = Date.now();
        let cacheAge = now - weatherCacheTime;
        if (cacheAge < CACHE_DURATION) {

            // if so we can display the weather
            console.log("Using cached weather data");
            displayWeather();
            return;
        }
    }

    // if cache or cacheTime are null
    try {
        // async fetch data from api
        console.log("Fetching fresh weather data");
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKey}`
        );

        // async store data in a local variable
        const data = await response.json();

        if (response.ok) {

            // update weather cache with new data
            weatherCache = data;
            weatherCacheTime = Date.now();
            console.log("Using fresh weather data");

            // display the info
            displayWeather();
            return;
        }
        
    } catch (error) {
        console.log(error);
    }
}

// API call to get latitude and longitude from user inputting city name (result[0] assumed to be top result for now)
async function getGeoCode() {
    const cityName = document.getElementById("userInput").value;

    if (geoCache && geoCacheTime) {
        const now = Date.now();
        let cacheAge = now - geoCacheTime;
        if (cacheAge < CACHE_DURATION) {
            console.log("Using cached geo data");
            displayGeo();
            return;
        }
    }

    try {
        console.log("Fetching fresh geo data");
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=10&language=en&format=json`
        );

        const data = await response.json();

        if (response.ok) {
            geoCache = data;
            geoCacheTime = Date.now();
            console.log("Using fresh geo data");
            displayGeo();
        }
    } catch (error) {
        console.log(error);
    }
}

// utility functions for displaying weather and geo info

function displayWeather() {
    const tempKelvin = weatherCache.main.temp;
    const temp = (tempKelvin - 273.15).toFixed(2);
    const weatherMain = weatherCache.weather[0].main;
    const desc = weatherCache.weather[0].description;
    const windDirection = weatherCache.wind.deg;
    const windSpeed = weatherCache.wind.speed;

    weatherInfo.innerHTML = "";

    weatherInfo.innerHTML = `
                <div class="weatherTemp">Temperature: ${temp} Degrees</div>
                <div class="weatherMain">Overview: ${weatherMain}</div>
                <div class="weatherDescription">Description: ${desc}</div>
                <div class="windSpeed">Wind Direction: ${windDirection} Degrees</div>
                <div class="windDirection">Wind Speed: ${windSpeed}Kts</div>
            `;
}

function displayGeo() {
    const name = geoCache.results[0].name;
    const country = geoCache.results[0].country_code;
    const latitude = geoCache.results[0].latitude;
    const longitude = geoCache.results[0].longitude;

    const cityInfo = document.getElementById("cityInfo");

    cityInfo.innerHTML = "";

    cityInfo.innerHTML = `
                <div class="weatherOverview">${name}, ${country}</div>
                <div class="weatherOverview">Latitude: ${latitude}</div>
                <div class="weatherOverview">Longitude ${longitude}</div>

            `;
}
