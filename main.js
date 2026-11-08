/* ==========================================================
Weather App – now powered by Open-Meteo (free, no API key)
========================================================== */

// ---------- Existing element references ----------
const weatherDataEl = document.getElementById("weather-data")
const cityInputEl = document.getElementById("city-input")
const formEl = document.querySelector("form")

// ---------- NEW element references ----------
const countrySelectEl = document.getElementById("country-select");
const citySelectEl = document.getElementById("city-select");
const searchBtnEl = formEl.querySelector('input[type="submit"]');

// ---------- NEW: Arab countries with governorates / major cities ----------
// code = ISO country code (used to match the right country when geocoding)
const arabCountries = [
    { name: "Algeria", code: "DZ", cities: "Algiers,Oran,Constantine,Annaba,Blida,Batna,Setif,Sidi Bel Abbes,Biskra,Tlemcen,Bejaia,Tizi Ouzou,Mostaganem,Ghardaia,Ouargla,Tamanrasset,Adrar,Bechar,Djelfa,Laghouat,Skikda,Jijel,Medea,Tebessa" },
    { name: "Bahrain", code: "BH", cities: "Manama,Muharraq,Riffa,Hamad Town,Isa Town,Sitra,Budaiya,Jidhafs" },
    { name: "Comoros", code: "KM", cities: "Moroni,Mutsamudu,Fomboni,Domoni,Mitsamiouli,Ouani" },
    { name: "Djibouti", code: "DJ", cities: "Djibouti,Ali Sabieh,Dikhil,Tadjoura,Obock,Arta" },
    { name: "Egypt", code: "EG", cities: "Cairo,Giza,Alexandria,Port Said,Suez,Luxor,Aswan,Asyut,Ismailia,Faiyum,Zagazig,Damietta,Mansoura,Tanta,Beni Suef,Minya,Sohag,Qena,Hurghada,Sharm El Sheikh,Marsa Matruh,Damanhur,Banha,Shibin El Kom,Kafr El Sheikh,El Arish,Al Tur,Kharga" },
    { name: "Iraq", code: "IQ", cities: "Baghdad,Basra,Mosul,Erbil,Sulaymaniyah,Kirkuk,Najaf,Karbala,Nasiriyah,Amarah,Diwaniyah,Hillah,Kut,Ramadi,Fallujah,Samawah,Duhok,Tikrit,Baqubah,Halabja" },
    { name: "Jordan", code: "JO", cities: "Amman,Irbid,Zarqa,Aqaba,Madaba,Jerash,Ajloun,Karak,Tafilah,Ma'an,Mafraq,Salt,Petra" },
    { name: "Kuwait", code: "KW", cities: "Kuwait City,Hawalli,Salmiya,Farwaniya,Jahra,Ahmadi,Mubarak Al-Kabeer,Fahaheel,Sabah Al Salem" },
    { name: "Lebanon", code: "LB", cities: "Beirut,Tripoli,Sidon,Tyre,Zahle,Baalbek,Jounieh,Byblos,Nabatieh,Aley,Bint Jbeil,Halba,Jezzine,Bsharri" },
    { name: "Libya", code: "LY", cities: "Tripoli,Benghazi,Misrata,Tobruk,Sabha,Zawiya,Bayda,Zliten,Ajdabiya,Sirte,Derna,Ghat,Murzuq,Kufra,Gharyan,Zuwara" },
    { name: "Mauritania", code: "MR", cities: "Nouakchott,Nouadhibou,Kiffa,Rosso,Atar,Zouerate,Kaedi,Aleg,Tidjikja,Nema,Selibaby" },
    { name: "Morocco", code: "MA", cities: "Rabat,Casablanca,Marrakesh,Fes,Tangier,Agadir,Meknes,Oujda,Tetouan,Kenitra,Laayoune,Dakhla,Essaouira,Safi,El Jadida,Nador,Al Hoceima,Beni Mellal,Ouarzazate,Errachidia,Chefchaouen,Taza,Khouribga" },
    { name: "Oman", code: "OM", cities: "Muscat,Seeb,Salalah,Sohar,Nizwa,Sur,Ibri,Rustaq,Buraimi,Khasab,Ibra,Duqm,Samail,Bahla" },
    { name: "Palestine", code: "PS", cities: "Jerusalem,Ramallah,Gaza,Hebron,Nablus,Bethlehem,Jenin,Tulkarm,Qalqilya,Jericho,Khan Yunis,Rafah,Deir al-Balah,Salfit,Tubas" },
    { name: "Qatar", code: "QA", cities: "Doha,Al Rayyan,Al Wakrah,Al Khor,Dukhan,Mesaieed,Umm Salal Mohammed,Madinat ash Shamal" },
    { name: "Saudi Arabia", code: "SA", cities: "Riyadh,Jeddah,Mecca,Medina,Dammam,Khobar,Dhahran,Taif,Tabuk,Buraydah,Abha,Khamis Mushait,Hail,Najran,Jazan,Al Hofuf,Jubail,Yanbu,Arar,Sakaka,Al Bahah,Qatif,Hafar Al-Batin,Al Kharj,Unaizah" },
    { name: "Somalia", code: "SO", cities: "Mogadishu,Hargeisa,Kismayo,Berbera,Bosaso,Garowe,Baidoa,Galkayo,Merca,Beledweyne,Borama,Burao,Jowhar,Las Anod" },
    { name: "Sudan", code: "SD", cities: "Khartoum,Omdurman,Port Sudan,Kassala,Nyala,El Obeid,Wad Madani,Atbara,Al Fashir,Gedaref,Kosti,Dongola,El Geneina,Ed Damazin,Sennar" },
    { name: "Syria", code: "SY", cities: "Damascus,Aleppo,Homs,Hama,Latakia,Tartus,Raqqa,Deir ez-Zor,Hasakah,Daraa,Suwayda,Idlib,Quneitra,Qamishli,Palmyra,Douma" },
    { name: "Tunisia", code: "TN", cities: "Tunis,Sfax,Sousse,Kairouan,Bizerte,Gabes,Ariana,Gafsa,Monastir,Ben Arous,Nabeul,Medenine,Tataouine,Tozeur,Kasserine,Jendouba,Beja,Kef,Mahdia,Siliana,Zaghouan,Sidi Bouzid,Kebili,Manouba,Houmt Souk" },
    { name: "United Arab Emirates", code: "AE", cities: "Abu Dhabi,Dubai,Sharjah,Ajman,Umm Al Quwain,Ras Al Khaimah,Fujairah,Al Ain,Khor Fakkan,Dibba Al-Fujairah,Madinat Zayed,Liwa Oasis" },
    { name: "Yemen", code: "YE", cities: "Sanaa,Aden,Taiz,Hodeidah,Ibb,Mukalla,Dhamar,Sayun,Marib,Saada,Zinjibar,Hajjah,Al Bayda,Lahij,Amran,Hadibu,Al Ghaydah,Shibam,Zabid" }
];

// Remembers the last location picked from the dropdowns (used to match the right country)
let dropdownPick = null;

// ---------- NEW: fill the country dropdown ----------
arabCountries.forEach((c, i) => {
    countrySelectEl.add(new Option(c.name, i));
});

// ---------- NEW: country selected -> show its cities ----------
countrySelectEl.addEventListener("change", () => {
    dropdownPick = null;
    citySelectEl.innerHTML = "";
    if (countrySelectEl.value === "") {
        citySelectEl.hidden = true; // city dropdown stays hidden until a country is chosen
        return;
    }
    const country = arabCountries[countrySelectEl.value];
    citySelectEl.add(new Option("Select Governorate / City", ""));
    country.cities.split(",").forEach(city => citySelectEl.add(new Option(city, city)));
    citySelectEl.hidden = false;
});

// ---------- NEW: city selected -> ONLY fill the search input (no fetch) ----------
citySelectEl.addEventListener("change", () => {
    if (citySelectEl.value === "") return;
    cityInputEl.value = citySelectEl.value;
    dropdownPick = { name: citySelectEl.value, code: arabCountries[countrySelectEl.value].code };
});

// ---------- Existing: Search button / form submit ----------
formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    const cityValue = cityInputEl.value;
    getWeatherData(cityValue);
});

// ---------- NEW: helpers ----------
// WMO weather code -> [description, OpenWeather icon number] (keeps your original icon style)
const weatherCodes = {
    0: ["Clear sky", "01"], 1: ["Mainly clear", "02"], 2: ["Partly cloudy", "03"], 3: ["Overcast", "04"],
    45: ["Fog", "50"], 48: ["Depositing rime fog", "50"],
    51: ["Light drizzle", "09"], 53: ["Moderate drizzle", "09"], 55: ["Dense drizzle", "09"],
    56: ["Light freezing drizzle", "09"], 57: ["Dense freezing drizzle", "09"],
    61: ["Slight rain", "10"], 63: ["Moderate rain", "10"], 65: ["Heavy rain", "10"],
    66: ["Light freezing rain", "13"], 67: ["Heavy freezing rain", "13"],
    71: ["Slight snow", "13"], 73: ["Moderate snow", "13"], 75: ["Heavy snow", "13"], 77: ["Snow grains", "13"],
    80: ["Slight rain showers", "09"], 81: ["Moderate rain showers", "09"], 82: ["Violent rain showers", "09"],
    85: ["Slight snow showers", "13"], 86: ["Heavy snow showers", "13"],
    95: ["Thunderstorm", "11"], 96: ["Thunderstorm with slight hail", "11"], 99: ["Thunderstorm with heavy hail", "11"]
};

// Degrees -> compass direction, e.g. 315 -> "NW"
function windDirection(deg) {
    const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return `${dirs[Math.round(deg / 22.5) % 16]} (${Math.round(deg)}°)`;
}

// Describe the UV index level
function uvLabel(uv) {
    if (uv < 3) return "Low";
    if (uv < 6) return "Moderate";
    if (uv < 8) return "High";
    if (uv < 11) return "Very high";
    return "Extreme";
}

// Escape text before putting it in innerHTML
function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

// Show a message in the results area and clear everything else
function showMessage(message) {
    weatherDataEl.querySelector(".icon").innerHTML = "";
    weatherDataEl.querySelector(".temperature").textContent = "";
    weatherDataEl.querySelector(".description").textContent = message;
    weatherDataEl.querySelector(".details").innerHTML = "";
}

// Turn the typed/selected name into coordinates using Open-Meteo geocoding
async function findLocation(query) {
    // Allows "Amman, Jordan": the part after the comma is used as a hint
    const [name, ...hintParts] = query.split(",").map(s => s.trim());
    const hint = hintParts.join(" ").toLowerCase();
    // Restrict to the dropdown's country only if the input still holds the dropdown's city
    const code = dropdownPick && dropdownPick.name.toLowerCase() === query.toLowerCase() ? dropdownPick.code : "";

    const search = async (countryCode) => {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=10&language=en&format=json`
            + (countryCode ? `&countryCode=${countryCode}` : "");
        const response = await fetch(url);
        if (!response.ok) throw new Error("Geocoding request failed");
        return (await response.json()).results || [];
    };

    let results = await search(code);
    if (!results.length && code) results = await search(""); // fallback if the country filter finds nothing
    if (hint) {
        const matches = results.filter(r => `${r.country || ""} ${r.admin1 || ""}`.toLowerCase().includes(hint));
        if (matches.length) results = matches;
    }
    return results[0] || null;
}

// ---------- Existing function, upgraded to Open-Meteo ----------
async function getWeatherData(cityValue) {
    cityValue = cityValue.trim();
    if (!cityValue) {
        showMessage("Please enter a city name or choose one from the list.");
        return;
    }

    // Loading indicator
    showMessage("Loading weather data...");
    searchBtnEl.disabled = true;

    try {
        const place = await findLocation(cityValue);
        if (!place) throw new Error("City not found");

        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}`
            + `&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,is_day,pressure_msl,wind_speed_10m,wind_direction_10m,visibility,uv_index`
            + `&daily=sunrise,sunset,uv_index_max&wind_speed_unit=kmh&timezone=auto&forecast_days=1`
        );
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();

        console.log(data);

        const cur = data.current;
        const [description, iconNum] = weatherCodes[cur.weather_code] || ["Unknown", "03"];
        const icon = iconNum + (cur.is_day ? "d" : "n");
        const temperature = Math.round(cur.temperature_2m);
        const uv = cur.uv_index ?? data.daily.uv_index_max[0];
        const locationName = [place.name, place.admin1 && place.admin1 !== place.name ? place.admin1 : "", place.country].filter(Boolean).join(", ");

        const details = [
            `location: ${escapeHtml(locationName)}`,
            `feels like: ${Math.round(cur.apparent_temperature)}°C`,
            `humidity: ${cur.relative_humidity_2m}%`,
            `wind speed: ${Math.round(cur.wind_speed_10m)} km/h`,
            `wind direction: ${windDirection(cur.wind_direction_10m)}`,
            `pressure: ${Math.round(cur.pressure_msl)} hPa`,
            `visibility: ${(cur.visibility / 1000).toFixed(1)} km`,
            `UV index: ${Math.round(uv * 10) / 10} (${uvLabel(uv)})`,
            `sunrise: ${data.daily.sunrise[0].slice(11, 16)}`,
            `sunset: ${data.daily.sunset[0].slice(11, 16)}`
        ];

        weatherDataEl.querySelector(".icon").innerHTML = `<img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">`;
        weatherDataEl.querySelector(".temperature").textContent = `${temperature}°C`;
        weatherDataEl.querySelector(".description").textContent = description;
        weatherDataEl.querySelector(".details").innerHTML = details.map(detail => `<div>${detail}</div>`).join("");
    } catch (error) {
        showMessage(error.message === "City not found"
            ? "Sorry, you have entered the city name incorrectly."
            : "Sorry, weather data could not be loaded. Please check your connection and try again.");
        console.error("Error fetching weather data:", error);
    } finally {
        searchBtnEl.disabled = false;
    }
}
