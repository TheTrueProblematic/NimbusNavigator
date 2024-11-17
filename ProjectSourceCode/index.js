const express = require('express'); // To build an application server or API
const app = express();
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const path = require('path');
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object.
const bcrypt = require('bcryptjs'); // To hash passwords
const axios = require('axios'); // To make HTTP requests from our server.
const zipcodes = require('zipcodes'); // For converting zip codes to latitude and longitude

// Create `ExpressHandlebars` instance and configure the layouts and partials dir.
const hbs = handlebars.create({
    extname: 'hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    helpers: {
        ifNotNA: function (value, options) {
            if (value !== 'N/A') {
                return options.fn(this);
            } else {
                return '';
            }
        },
    },
});

// Database configuration
const dbConfig = {
    host: 'db', // The database server
    port: 5432, // The database port
    database: process.env.POSTGRES_DB, // The database name
    user: process.env.POSTGRES_USER, // The user account to connect with
    password: process.env.POSTGRES_PASSWORD, // The password of the user account
};

const db = pgp(dbConfig);

// Test your database
db.connect()
    .then(obj => {
        console.log('Database connection successful'); // You can view this message in the docker compose logs
        obj.done(); // Success, release the connection
    })
    .catch(error => {
        console.log('ERROR:', error.message || error);
    });

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json()); // Specify the usage of JSON for parsing request body.

// Initialize session variables
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
    })
);

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

// Serve static files from the fillerImages directory
app.use('/fillerImages', express.static(path.join(__dirname, 'fillerImages')));
// Serve static files from a 'public' directory for icons
app.use('/public', express.static(path.join(__dirname, 'public')));

// Root route redirects to login
app.get('/', (req, res) => {
    res.redirect('/login');
});

// GET /register - Render the registration page
app.get('/register', (req, res) => {
    res.render('pages/register');
});

// POST /register - Handle user registration
app.post('/register', async (req, res) => {
    try {
        // Hash the password using bcrypt library
        var hashy;
        if (req.body.password === req.body.cpassword) {
            hashy = await bcrypt.hash(req.body.password, 10);
        } else {
            console.error('Passwords do not match.');
            return res.render('pages/register', {message: 'Passwords do not match.', error: true});
        }
        const hash = hashy;
        // Insert username and hashed password into the 'users' table
        const query = 'INSERT INTO users (name, username, zipcode, password) VALUES ($1, $2, $3, $4)';
        await db.none(query, [req.body.name, req.body.username, req.body.zip, hash]);

        // Redirect to login page
        res.redirect('/login');
    } catch (error) {
        console.error('Error inserting user:', error);
        return res.render('pages/register', {message: error.message, error: true});
    }
});

// GET /login - Render the login page
app.get('/login', (req, res) => {
    res.render('pages/login');
});

// POST /login - Handle user login
app.post('/login', async (req, res) => {
    try {
        // Get user from database
        const query = 'SELECT * FROM users WHERE username = $1';
        const user = await db.oneOrNone(query, [req.body.username]);

        if (!user) {
            // User not found, redirect to register
            res.render('pages/login', {message: 'Incorrect username or password.', error: true});
        } else {
            // Compare password
            const match = await bcrypt.compare(req.body.password, user.password);
            if (match) {
                // Save user details in session
                req.session.user = user;
                req.session.save();
                // Redirect to /currentWeather
                res.redirect('/currentWeather');
            } else {
                // Incorrect password
                res.render('pages/login', {message: 'Incorrect username or password.', error: true});
            }
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.render('pages/login', {message: 'An error occurred.', error: true});
    }
});

// Authentication Middleware
const auth = (req, res, next) => {
    if (!req.session.user) {
        // Default to login page
        return res.redirect('/login');
    }
    next();
};

// Apply authentication middleware to all routes after this
app.use(auth);

// Function to determine Beaufort number based on wind speed in mph
function getBeaufortNumber(windSpeedMph) {
    if (windSpeedMph < 1) return 0;
    if (windSpeedMph >= 1 && windSpeedMph <= 3) return 1;
    if (windSpeedMph >= 4 && windSpeedMph <= 7) return 2;
    if (windSpeedMph >= 8 && windSpeedMph <= 12) return 3;
    if (windSpeedMph >= 13 && windSpeedMph <= 18) return 4;
    if (windSpeedMph >= 19 && windSpeedMph <= 24) return 5;
    if (windSpeedMph >= 25 && windSpeedMph <= 31) return 6;
    if (windSpeedMph >= 32 && windSpeedMph <= 38) return 7;
    if (windSpeedMph >= 39 && windSpeedMph <= 46) return 8;
    if (windSpeedMph >= 47 && windSpeedMph <= 54) return 9;
    if (windSpeedMph >= 55 && windSpeedMph <= 63) return 10;
    if (windSpeedMph >= 64 && windSpeedMph <= 72) return 11;
    if (windSpeedMph >= 73) return 12;
    return 0; // Default to 0 if no match
}

// Function to convert wind speed to m/s based on unit code
function convertWindSpeedToMps(value, unitCode) {
    if (value === null || unitCode === null) {
        return null;
    }

    if (unitCode.endsWith('m_s-1')) {
        return value; // Already in m/s
    } else if (unitCode.endsWith('km_h-1')) {
        return value / 3.6; // Convert km/h to m/s
    } else if (unitCode.endsWith('kn')) {
        return value * 0.514444; // Convert knots to m/s
    } else if (unitCode.endsWith('mi_h-1')) {
        return value * 0.44704; // Convert mph to m/s
    } else {
        console.warn('Unknown wind speed unit:', unitCode);
        return null;
    }
}

// GET /currentWeather - Display current weather and forecast
app.get('/currentWeather', (req, res) => {
    var zip = req.session.user.zipcode;
    var name = req.session.user.name;
    var username = req.session.user.username;

    // Get latitude and longitude from zip code
    const location = zipcodes.lookup(zip);

    if (!location) {
        return res.render('pages/currentWeather', {message: 'Invalid zip code.', error: true});
    }

    const latitude = location.latitude;
    const longitude = location.longitude;

    axios({
        url: `https://api.weather.gov/points/${latitude},${longitude}`,
        method: 'GET',
        headers: {
            'Accept-Encoding': 'application/json',
        },
    })
        .then(response => {
            const forecastUrl = response.data.properties.forecast;
            const observationStationsUrl = response.data.properties.observationStations;

            // Use Promise.all to make multiple requests in parallel
            return Promise.all([
                axios.get(forecastUrl),
                axios.get(observationStationsUrl),
            ]);
        })
        .then(([forecastResponse, stationsResponse]) => {
            const forecastData = forecastResponse.data;
            const stationsData = stationsResponse.data;

            // Get the first station ID
            const stationId = stationsData.features[0].properties.stationIdentifier;

            // Construct the URL to get latest observations
            const observationsUrl = `https://api.weather.gov/stations/${stationId}/observations/latest`;

            // Make a request to get the latest observations
            return Promise.all([
                forecastData,
                axios.get(observationsUrl),
            ]);
        })
        .then(([forecastData, observationsResponse]) => {
            const observationsData = observationsResponse.data;

            // Extract the data we need and pass to the template
            const temperatures = forecastData.properties.periods.map(period => ({
                name: period.name,
                temperature: period.temperature,
                temperatureUnit: period.temperatureUnit,
                detailedForecast: period.detailedForecast,
            }));

            const todayForecast = forecastData.properties.periods[0];

            // Extract weather statistics from observationsData
            const props = observationsData.properties;

            const currentTempC = props.temperature.value;
            const currentConditions = props.textDescription;

            // Extract wind speed value and unit code
            const windSpeedValue = props.windSpeed.value;
            const windSpeedUnitCode = props.windSpeed.unitCode;
            const windSpeedMps = convertWindSpeedToMps(windSpeedValue, windSpeedUnitCode);

            // Extract wind gust value and unit code
            const windGustValue = props.windGust.value;
            const windGustUnitCode = props.windGust.unitCode;
            const windGustMps = convertWindSpeedToMps(windGustValue, windGustUnitCode);

            // Extract barometric pressure value and unit code
            const barometricPressureValue = props.barometricPressure.value;
            const barometricPressureUnitCode = props.barometricPressure.unitCode;

            // Extract sea level pressure value and unit code
            const seaLevelPressureValue = props.seaLevelPressure.value;
            const seaLevelPressureUnitCode = props.seaLevelPressure.unitCode;

            // Extract visibility value and unit code
            const visibilityValue = props.visibility.value;
            const visibilityUnitCode = props.visibility.unitCode;

            const windDirection = props.windDirection.value; // degrees
            const maxTempPast24HC = props.maxTemperatureLast24Hours.value; // C
            const minTempPast24HC = props.minTemperatureLast24Hours.value; // C
            const precipitationLastHourMm = props.precipitationLastHour.value; // mm
            const precipitationLast3HoursMm = props.precipitationLast3Hours.value; // mm
            const precipitationLast6HoursMm = props.precipitationLast6Hours.value; // mm
            const relativeHumidity = props.relativeHumidity.value; // %
            const windChillC = props.windChill.value; // C
            const heatIndexC = props.heatIndex.value; // C
            const dewpointC = props.dewpoint.value; // C

            // Convert units as necessary
            const currentTempF = currentTempC !== null ? (currentTempC * 9) / 5 + 32 : null;
            const windChillF = windChillC !== null ? (windChillC * 9) / 5 + 32 : null;
            const heatIndexF = heatIndexC !== null ? (heatIndexC * 9) / 5 + 32 : null;
            const dewpointF = dewpointC !== null ? (dewpointC * 9) / 5 + 32 : null;
            const maxTempPast24HF = maxTempPast24HC !== null ? (maxTempPast24HC * 9) / 5 + 32 : null;
            const minTempPast24HF = minTempPast24HC !== null ? (minTempPast24HC * 9) / 5 + 32 : null;

            const windSpeedMph = windSpeedMps !== null ? windSpeedMps * 2.23694 : null;
            const windGustMph = windGustMps !== null ? windGustMps * 2.23694 : null;

            // Convert barometric pressure to inches of mercury if unit is in Pascals
            let barometricPressureInHg = null;
            if (barometricPressureValue !== null && barometricPressureUnitCode) {
                if (barometricPressureUnitCode.endsWith('Pa')) {
                    barometricPressureInHg = barometricPressureValue * 0.0002953;
                } else {
                    console.warn('Unknown barometric pressure unit:', barometricPressureUnitCode);
                }
            }

            // Convert sea level pressure to inches of mercury if unit is in Pascals
            let seaLevelPressureInHg = null;
            if (seaLevelPressureValue !== null && seaLevelPressureUnitCode) {
                if (seaLevelPressureUnitCode.endsWith('Pa')) {
                    seaLevelPressureInHg = seaLevelPressureValue * 0.0002953;
                } else {
                    console.warn('Unknown sea level pressure unit:', seaLevelPressureUnitCode);
                }
            }

            // Convert visibility to miles if unit is in meters
            let visibilityMiles = null;
            if (visibilityValue !== null && visibilityUnitCode) {
                if (visibilityUnitCode.endsWith('m')) {
                    visibilityMiles = visibilityValue / 1609.34;
                } else {
                    console.warn('Unknown visibility unit:', visibilityUnitCode);
                }
            }

            const precipitationInches =
                precipitationLastHourMm !== null ? precipitationLastHourMm / 25.4 : 0.00;
            const precipitation3hInches =
                precipitationLast3HoursMm !== null ? precipitationLast3HoursMm / 25.4 : 0.00;
            const precipitation6hInches =
                precipitationLast6HoursMm !== null ? precipitationLast6HoursMm / 25.4 : 0.00;

            // Prepare data for the template
            const templateData = {
                temperatures: temperatures,
                currentTemp: currentTempF !== null ? currentTempF.toFixed(1) : 'N/A',
                currentConditions: currentConditions || 'N/A',
                windSpeed: windSpeedMph !== null ? windSpeedMph.toFixed(1) : 'N/A',
                windDirection: windDirection !== null ? windDirection.toFixed(0) : 'N/A',
                windGust: windGustMph !== null ? windGustMph.toFixed(1) : 'N/A',
                barometricPressure: barometricPressureInHg !== null ? barometricPressureInHg.toFixed(2) : 'N/A',
                seaLevelPressure: seaLevelPressureInHg !== null ? seaLevelPressureInHg.toFixed(2) : 'N/A',
                visibility: visibilityMiles !== null ? visibilityMiles.toFixed(1) : 'N/A',
                maxTempPast24H: maxTempPast24HF !== null ? maxTempPast24HF.toFixed(1) : 'N/A',
                minTempPast24H: minTempPast24HF !== null ? minTempPast24HF.toFixed(1) : 'N/A',
                precipitation: precipitationInches.toFixed(2),
                precipitation3h: precipitation3hInches.toFixed(2),
                precipitation6h: precipitation6hInches.toFixed(2),
                humidity: relativeHumidity !== null ? relativeHumidity.toFixed(1) : 'N/A',
                windChill: windChillF !== null ? windChillF.toFixed(1) : 'N/A',
                heatIndex: heatIndexF !== null ? heatIndexF.toFixed(1) : 'N/A',
                dewpoint: dewpointF !== null ? dewpointF.toFixed(1) : 'N/A',
                todayForecast: todayForecast,
                name: name,
                username: username,
                zip: zip,
                moonPhaseString: "test",
            };

            // Determine which image to use based on today's forecast description
            const description = todayForecast.detailedForecast.toLowerCase();
            let imageName = 'other.png';

            if (description.includes('snow') || description.includes('snowy')) {
                imageName = 'snowy.png';
            } else if (description.includes('rain') || description.includes('rainy')) {
                imageName = 'rainy.png';
            } else if (description.includes('cloudy')) {
                imageName = 'cloudy.png';
            } else if (description.includes('sunny')) {
                imageName = 'sunny.png';
            } else {
                imageName = 'other.png';
            }

            templateData.imageName = imageName;

            // Determine which weather icon to use based on current conditions
            // Map conditions to icons
            const weatherIcons = [
                {keywords: ['clear', 'sunny'], icon: 'clear-day.svg'},
                {keywords: ['cloudy'], icon: 'cloudy.svg'},
                {keywords: ['overcast'], icon: 'overcast.svg'},
                {keywords: ['drizzle'], icon: 'drizzle.svg'},
                {keywords: ['hail'], icon: 'hail.svg'},
                {keywords: ['rain'], icon: 'rain.svg'},
                {keywords: ['sleet'], icon: 'sleet.svg'},
                {keywords: ['smoke'], icon: 'smoke.svg'},
                {keywords: ['snow'], icon: 'snow.svg'},
                {keywords: ['mist'], icon: 'mist.svg'},
                {keywords: ['hurricane'], icon: 'hurricane.svg'},
                {keywords: ['tornado'], icon: 'tornado.svg'},
                {keywords: ['wind'], icon: 'wind.svg'},
                {keywords: ['dust'], icon: 'dust.svg'},
                {keywords: ['thunderstorms', 'thunderstorm'], icon: 'thunderstorms.svg'},
                {keywords: ['fog'], icon: 'fog.svg'},
                {keywords: ['haze'], icon: 'haze.svg'},
                // Add more mappings as needed
            ];

            let weatherIcon = 'other.svg';
            for (const item of weatherIcons) {
                for (const keyword of item.keywords) {
                    if (description.includes(keyword)) {
                        weatherIcon = item.icon;
                        break;
                    }
                }
                if (weatherIcon !== 'other.svg') break;
            }

            templateData.weatherIcon = weatherIcon;

            // Fetch moon phase data
            const today = new Date();
            const moonPhaseApiUrl = `https://api.farmsense.net/v1/moonphases/?d=${Math.floor(
                today.getTime() / 1000
            )}`;

            return Promise.all([templateData, axios.get(moonPhaseApiUrl)]);
        })
        .then(([templateData, moonResponse]) => {
            const moonData = moonResponse.data[0];
            const moonPhase = moonData.Phase.toLowerCase();
            const moonPhaseNorm = moonData.Phase;


            // Map moon phases to icons
            const moonPhases = {
                'new moon': 'moon-new.svg',
                'waxing crescent': 'moon-waxing-crescent.svg',
                'first quarter': 'moon-first-quarter.svg',
                'waxing gibbous': 'moon-waxing-gibbous.svg',
                'full moon': 'moon-full.svg',
                'waning gibbous': 'moon-waning-gibbous.svg',
                'last quarter': 'moon-last-quarter.svg',
                'waning crescent': 'moon-waning-crescent.svg',
            };

            let moonIcon = 'moon-new.svg'; // Default icon
            for (const phase in moonPhases) {
                if (moonPhase.includes(phase)) {
                    moonIcon = moonPhases[phase];
                    break;
                }
            }

            templateData.moonIcon = moonIcon;
            templateData.moonPhaseString = moonPhaseNorm;

            // Determine wind icon based on wind speed using Beaufort scale
            const windSpeedMph = parseFloat(templateData.windSpeed);

            const beaufortNumber = getBeaufortNumber(windSpeedMph);
            const windIcon = `wind-beaufort-${beaufortNumber}.svg`;
            templateData.windIcon = windIcon;

            res.render('pages/currentWeather', templateData);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            res.render('pages/currentWeather', {temperatures: [], message: 'Error fetching data', error: true});
        });
});

// GET /logout - Log the user out
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.render('pages/logout', {message: 'Logged out Successfully'});
});

// NIMBUSNAV ROUTES
app.get('/climateContest', (req, res) => {
    res.render('pages/climateContest');
});
app.get('/weatherFacts', (req, res) => {
    res.render('pages/weatherFacts');
});
app.get('/forecast', (req, res) => {
    var zip = req.session.user.zipcode;
    const location = zipcodes.lookup(zip);

    if (!location) {
        return res.render('pages/forecast', {message: 'Invalid zip code.', error: true});
    }

    const latitude = location.latitude;
    const longitude = location.longitude;

    axios.get(`https://api.weather.gov/points/${latitude},${longitude}/forecast/hourly`)
        .then(response => {
            const hourlyForecasts = response.data.properties.periods;

            // Group data by day of the week
            const weeklyForecast = hourlyForecasts.reduce((acc, forecast) => {
                const dayName = new Date(forecast.startTime).toLocaleDateString('en-US', {weekday: 'long'});
                if (!acc[dayName]) acc[dayName] = [];
                acc[dayName].push({
                    hour: new Date(forecast.startTime).getHours(),
                    temperature: forecast.temperature,
                    temperatureUnit: forecast.temperatureUnit,
                    shortForecast: forecast.shortForecast,
                });
                return acc;
            }, {});

            // Pass to template
            res.render('pages/forecast', {weeklyForecast});
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            res.render('pages/forecast', {weeklyForecast: [], error: true});
        });
});
app.get('/weeklyForecast', (req, res) => {
    var zip = req.session.user.zipcode;
    const location = zipcodes.lookup(zip);

    if (!location) {
        return res.render('pages/weeklyForecast', {message: 'Invalid zip code.', error: true});
    }

    const latitude = location.latitude;
    const longitude = location.longitude;

    axios.get(`https://api.weather.gov/points/${latitude},${longitude}/forecast/hourly`)
        .then(response => {
            const hourlyForecasts = response.data.properties.periods;

            // Group data by day of the week
            const weeklyForecast = hourlyForecasts.reduce((acc, forecast) => {
                const dayName = new Date(forecast.startTime).toLocaleDateString('en-US', {weekday: 'long'});
                if (!acc[dayName]) acc[dayName] = [];
                acc[dayName].push({
                    hour: new Date(forecast.startTime).getHours(),
                    temperature: forecast.temperature,
                    temperatureUnit: forecast.temperatureUnit,
                    shortForecast: forecast.shortForecast,
                });
                return acc;
            }, {});

            // Pass to template
            res.render('pages/weeklyForecast', {weeklyForecast});
        })
        .catch(error => {
            console.error('Error fetching hourly weeklyForecast data:', error);
            res.render('pages/weeklyForecast', {weeklyForecast: [], error: true});
        });
});

// Starting the server and keeping the connection open to listen for more requests
app.listen(3000);
console.log('Server is listening on port 3000');
