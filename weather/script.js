/* ------------------- AQI CHECK ------------------- */
async function checkAirQuality() {
    const lat = document.getElementById('lat').value;
    const lon = document.getElementById('lon').value;
    const result = document.getElementById('result');

    if (!lat || !lon) {
        result.innerHTML = "Please enter both latitude and longitude.";
        return;
    }

    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,sulphur_dioxide,us_aqi`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        const aq = data.hourly;

        result.innerHTML = `
            <p><b>AIR QUALITY</b></p>
            <p>AQI: ${aq.us_aqi[0]}</p>
            <p>CO: ${aq.carbon_monoxide[0]}</p>
            <p>NO2: ${aq.nitrogen_dioxide[0]}</p>
            <p>O3: ${aq.ozone[0]}</p>
            <p>PM2.5: ${aq.pm2_5[0]}</p>
            <p>PM10: ${aq.pm10[0]}</p>
            <p>SO2: ${aq.sulphur_dioxide[0]}</p>
        `;
    } catch (err) {
        result.innerHTML = "Error fetching AQI data.";
    }
}

/* ---------------- WEATHER BY PLACE ---------------- */
async function getWeatherByName(place) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${place}&count=1`;
    const geo = await fetch(url).then(r => r.json());

    if (!geo.results) return null;

    const { latitude, longitude, name } = geo.results[0];

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const weather = await fetch(weatherUrl).then(r => r.json());

    return { ...weather.current_weather, name };
}

/* WEATHER ICONS */
function getIcon(code) {
    if (code === 0) return "☀️ Sunny";
    if ([1, 2].includes(code)) return "🌤️ Partly Cloudy";
    if (code === 3) return "☁️ Cloudy";
    if ([45, 48].includes(code)) return "🌫️ Fog";
    if ([51, 53, 55].includes(code)) return "🌦️ Drizzle";
    if ([61, 63, 65].includes(code)) return "🌧️ Rain";
    if ([71, 73, 75].includes(code)) return "❄️ Snow";
    return "🌍 Weather";
}

async function checkPlaceWeather() {
    const place = document.getElementById('place').value;
    const result = document.getElementById('placeResult');

    if (!place) {
        result.innerHTML = "Enter a valid place";
        return;
    }

    const data = await getWeatherByName(place);

    if (!data) {
        result.innerHTML = "Place not found";
        return;
    }

    result.innerHTML = `
        <p><b>Weather in ${data.name}</b></p>
        <p>Temperature: ${data.temperature}°C</p>
        <p>Wind Speed: ${data.windspeed} km/h</p>
        <p>${getIcon(data.weathercode)}</p>
    `;
}
