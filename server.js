var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var path = require('path');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var errorhandler = require('errorhandler');
var session      = require('express-session');
var configDB = require('./config/database.js');
const ejsLint = require('ejs-lint');
var isProduction = process.env.NODE_ENV === 'production';
// configuration ===============================================================

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // set up ejs for templating

ejsLint('./views/projects.ejs');


// required for passport
app.use(session({
    secret: 'jaishriram', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));


// routes ======================================================================
var routes = require('./app/routes.js');

app.use(express.static(path.join(__dirname, 'views')));

app.use("/public/assets", express.static(__dirname + '/public/assets'));
app.use("/public/vendors", express.static(__dirname + '/public/vendors'));
app.use("/public/vendors", express.static(__dirname + '/public/uploads'));
app.use('/', routes);

if (!isProduction) {
  app.use(errorhandler());
}

if(isProduction){
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect(configDB.url);
  mongoose.set('debug', true);
}

// /// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(function(err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({'errors': {
      message: err.message,
      error: err
    }});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({'errors': {
    message: err.message,
    error: {}
  }});
});
// launch ======================================================================

app.listen(port);
console.log('The magic happens on port ' + port);


