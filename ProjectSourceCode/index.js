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
        const hash = await bcrypt.hash(req.body.password, 10);

        // Insert username and hashed password into the 'users' table
        const query = 'INSERT INTO users (username, password) VALUES ($1, $2)';
        await db.none(query, [req.body.username, hash]);

        // Redirect to login page
        res.redirect('/login');
    } catch (error) {
        console.error('Error inserting user:', error);
        // Redirect back to register page
        res.redirect('/register');
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
            res.redirect('/register');
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
                res.render('pages/login', { message: 'Incorrect username or password.', error: true });
            }
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.render('pages/login', { message: 'An error occurred.', error: true });
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

// GET /currentWeather - Display current weather and forecast
app.get('/currentWeather', (req, res) => {
    axios({
        url: 'https://api.weather.gov/points/40.0150,-105.2705',
        method: 'GET',
        headers: {
            'Accept-Encoding': 'application/json',
        },
    })
        .then(response => {
            const forecastUrl = response.data.properties.forecast;
            const observationStationsUrl = response.data.properties.observationStations;

            // Use Promise.all to make both requests in parallel
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

            const windSpeedMps = props.windSpeed.value; // m/s
            const windDirection = props.windDirection.value; // degrees
            const windGustMps = props.windGust.value; // m/s
            const barometricPressurePa = props.barometricPressure.value; // Pa
            const seaLevelPressurePa = props.seaLevelPressure.value; // Pa
            const visibilityMeters = props.visibility.value; // meters
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
            const barometricPressureInHg = barometricPressurePa !== null ? barometricPressurePa * 0.0002953 : null;
            const seaLevelPressureInHg = seaLevelPressurePa !== null ? seaLevelPressurePa * 0.0002953 : null;
            const visibilityMiles = visibilityMeters !== null ? visibilityMeters / 1609.34 : null;
            const precipitationInches =
                precipitationLastHourMm !== null ? precipitationLastHourMm / 25.4 : null;
            const precipitation3hInches =
                precipitationLast3HoursMm !== null ? precipitationLast3HoursMm / 25.4 : null;
            const precipitation6hInches =
                precipitationLast6HoursMm !== null ? precipitationLast6HoursMm / 25.4 : null;

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
                precipitation: precipitationInches !== null ? precipitationInches.toFixed(2) : '0.00',
                precipitation3h: precipitation3hInches !== null ? precipitation3hInches.toFixed(2) : '0.00',
                precipitation6h: precipitation6hInches !== null ? precipitation6hInches.toFixed(2) : '0.00',
                humidity: relativeHumidity !== null ? relativeHumidity.toFixed(1) : 'N/A',
                windChill: windChillF !== null ? windChillF.toFixed(1) : 'N/A',
                heatIndex: heatIndexF !== null ? heatIndexF.toFixed(1) : 'N/A',
                dewpoint: dewpointF !== null ? dewpointF.toFixed(1) : 'N/A',
                todayForecast: todayForecast,
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

            // Fetch air quality data from BreezoMeter API
            const breezometerApiKey = process.env.BREEZOMETER_API_KEY;
            const lat = 40.0150;
            const lon = -105.2705;
            const breezometerUrl = `https://api.breezometer.com/air-quality/v2/current-conditions?lat=${lat}&lon=${lon}&key=${breezometerApiKey}`;

            axios
                .get(breezometerUrl)
                .then(breezometerResponse => {
                    const airQualityData = breezometerResponse.data;
                    const aqi = airQualityData.data.indexes.baqi.aqi;
                    const aqiCategory = airQualityData.data.indexes.baqi.category;

                    templateData.airQuality = `${aqi} (${aqiCategory})`;

                    res.render('pages/currentWeather', templateData);
                })
                .catch(error => {
                    console.error('Error fetching air quality data:', error);

                    templateData.airQuality = 'N/A';

                    res.render('pages/currentWeather', templateData);
                });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            res.render('pages/currentWeather', { temperatures: [], message: 'Error fetching data', error: true });
        });
});

// GET /logout - Log the user out
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.render('pages/logout', { message: 'Logged out Successfully' });
});

// NIMBUSNAV ROUTES
app.get('/climateContest', (req, res) => {
    res.render('pages/climateContest');
});
app.get('/weatherFacts', (req, res) => {
    res.render('pages/weatherFacts');
});

// Starting the server and keeping the connection open to listen for more requests
app.listen(3000);
console.log('Server is listening on port 3000');
