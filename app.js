
const express = require('express');
const app = express();
const settings = require('./settings');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const sessions = require('client-sessions');
const auth = require('./api/middleware/user_check')

//  DB
const connectionURL ='mongodb://' + settings.MONGO_USER + ':' + settings.MONGO_PW + settings.MONGO_URI;

mongoose.connect(connectionURL, {useNewUrlParser: true, useCreateIndex: true});

mongoose.Promise = global.Promise;
//  Logging
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//  Allow CORS access
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

//  Paths
app.set('views', path.join(__dirname, '/api/view'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

//  Cookies
app.set('trust proxy', 1) // trust first proxy
app.use(sessions({
  secret: settings.COOKIE_SECRET,
  cookieName: 'session',
  resave: true,
  saveUninitialized: true,
  cookie: {
      secure: false,
      httpOnly: true,
      ephemeral: true,
      overwrite: true
    }
}));

//  ROUTES
//  Landing Route
app.use('/', require('./api/routes/index'));

//  Users Route
app.use('/users', require('./api/routes/users'));

//  Admin Route
//  Using auth middleware to protect endpoint and ensure login
app.use('/admin', auth, require('./api/routes/admin'));

//  CUSTOM ERROR HANDLING
app.use((req, res, next) => {
    const error = new Error('404 Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

//  export the app
module.exports = app;