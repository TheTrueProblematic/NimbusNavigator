// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

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

// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// Create `ExpressHandlebars` instance and configure the layouts and partials dir.
const hbs = handlebars.create({
    extname: 'hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
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

// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************

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

// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************

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
                // Redirect to /discover
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

// GET /discover - Display events from Ticketmaster API
// app.get('/discover', (req, res) => {
//     axios({
//         url: 'https://app.ticketmaster.com/discovery/v2/events.json',
//         method: 'GET',
//         dataType: 'json',
//         headers: {
//             'Accept-Encoding': 'application/json',
//         },
//         params: {
//             apikey: process.env.API_KEY,
//             keyword: 'music', // You can choose any keyword here
//             size: 10, // Number of events to return
//         },
//     })
//         .then(response => {
//             const events = response.data._embedded ? response.data._embedded.events : [];
//             res.render('pages/discover', { events: events });
//         })
//         .catch(error => {
//             console.error('Error fetching events:', error);
//             res.render('pages/discover', { events: [], message: 'Error fetching events', error: true });
//         });
// });

app.get('/currentWeather', (req, res) => {
    axios({
        url: 'https://api.weather.gov/points/40.0150,-105.2705',
        method: 'GET',
        headers: {
            'Accept-Encoding': 'application/json',
        },
    })
        .then(response => {
            // Sets URL that responds with forecast data
            // This second URL is returned within the first response
            const forecastUrl = response.data.properties.forecast;

            // Fetch forecast data using response from first URL
            // https://api.weather.gov/points/40.0150,-105.2705
            return axios({
                url: forecastUrl,
                method: 'GET',
                headers: {
                    'Accept-Encoding': 'application/json',
                },
            });
        })
        .then(forecastResponse => {
            const forecastData = forecastResponse.data;

            // Get information from forecast (ex. temperature)
            const temperatures = forecastData.properties.periods.map(period => ({
                name: period.name, // Time period (ex. tuesday, tuesday night)
                temperature: period.temperature, // Temperature
                temperatureUnit: period.temperatureUnit, // Unit (i think this is always in F)
                detailedForecast: period.detailedForecast, // Description of forecast
            }));

            res.render('pages/currentWeather', { temperatures: temperatures });
        })
        .catch(error => {
            console.error('Error fetching forecast:', error);
            res.render('pages/currentWeather', { temperatures: [], message: 'Error fetching forecast', error: true });
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
app.get('/currentWeather', (req, res) => {
    res.render('pages/currentWeather');
});
app.get('/weatherFacts', (req, res) => {
    res.render('pages/weatherFacts');
});

// *****************************************************
// <!-- Section 5 : Start Server -->
// *****************************************************

// Starting the server and keeping the connection open to listen for more requests
app.listen(3000);
console.log('Server is listening on port 3000');