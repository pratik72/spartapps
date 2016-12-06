var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
var passport = require('passport');
var expressSession = require('express-session');
var flash = require('connect-flash');
var hbs = require('hbs');
var fs = require('fs');

var index = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/app-admin');
var dashboard = require('./routes/dashboard');

var passportConfig = require('./auth/passport-config');
var restrict = require('./auth/restrict');

passportConfig();

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/spartadb');
//mongoose.createConnection('localhost', 'spartadb', '27017');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

var partialsDir = __dirname + '/views/template';

var filenames = fs.readdirSync(partialsDir);

filenames.forEach(function (filename) {
  var matches = /^([^.]+).hbs$/.exec(filename);
  if (!matches) {
    return;
  }
  var name = matches[1];
  var template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
  hbs.registerPartial(name, template);
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession({
	secret: "The Spartan",
	saveUninitialized: false,
	resave: false
}));

app.use( flash() );
app.use( passport.initialize() );
app.use( passport.session() );

//app.use(restrict)
app.use('/', index);
app.use('/login', index);
app.use('/users', users);
app.use('/app-admin', admin);
app.use('/dashboard', dashboard)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
