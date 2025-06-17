
document.addEventListener("keydown", function (event) {
    if (event.key === ("Enter")) {
        getWeather();
        getGeoCode();
    }
});

const weatherInfo = document.getElementById("weatherInfo");

// function to get weather forecast based on user inputting city name
async function getWeather() {

    const cityName = document.getElementById("userInput").value;
    const APIKey = "83cf14a6a2dd86474328a3acb4585de5";

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKey}`);
        const data = await response.json();

        if (response.ok) {

            console.log(data);
            console.log(data.visibility);
            console.log(data.main.temp);
            console.log(data.weather[0].id);

            const tempKelvin = data.main.temp;
            const temp = (tempKelvin - 273.15).toFixed(2);
            const desc = data.weather[0].description;
            const windDirection = data.wind.deg;
            const windSpeed = data.wind.speed;

            weatherInfo.innerHTML = "";

            weatherInfo.innerHTML = `
            <div class="weatherTemp">Temperature: ${temp} Degrees</div>
            <div class="weatherDescription">Description: ${desc}</div>
            <div class="windSpeed">Wind Direction: ${windDirection} Degrees</div>
            <div class="windDirection">Wind Speed: ${windSpeed}Kts</div>
            `;
        }

    }
    catch (error) {
        console.log(error);
    }
};

// API call to get latitude and longitude from user inputting city name (result[0] assumed to be top result for now)
async function getGeoCode() {

    const cityName = document.getElementById("userInput").value;

    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=10&language=en&format=json`);

        const data = await response.json();

        if (response.ok) {
            console.log(data.results[0]);
            console.log(data.results[0].latitude);
            console.log(data.results[0].longitude);

            const name = data.results[0].name;
            const country = data.results[0].country_code;
            const latitude = data.results[0].latitude;
            const longitude = data.results[0].longitude;

            const cityInfo = document.getElementById("cityInfo");

            cityInfo.innerHTML = '';

            cityInfo.innerHTML = `
                        <div class="weatherOverview">${name}, ${country}</div>
                        <div class="weatherOverview">Latitude: ${latitude}</div>
                        <div class="weatherOverview">Longitude ${longitude}</div>

            `;

        }

    }
    catch (error) {
        console.log(error);
    }
}

