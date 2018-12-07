
const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');


//  DB
const connectionURL ='mongodb://' + process.env.MONGO_USER + ':' + process.env.MONGO_PW + '@ds035806.mlab.com:35806/mlab_2014'
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


//  Passport Configuration
passport.serializeUser(function (user, cb) {
    cb(null, user.id);
  });

  passport.deserializeUser(function (id, cb) {
    userService.findById(id, function (err, user) {
      if (err) {
        return cb(err);
      }
      cb(null, user);
    });
  });


//  Cookies
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

//  ROUTES
//  Landing Route
app.use('/', require('./api/routes/index'));

//  Users Route
app.use('/users', require('./api/routes/users'));

//  Admin Route
app.use('/admin', require('./api/routes/admin'));



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