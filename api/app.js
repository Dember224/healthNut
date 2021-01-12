var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const session = require('express-session');
const signup = require('./routes/signup.js');
const signin = require('./routes/signin.js');
const setGoals = require('./routes/setGoals.js');
const findFood = require('./routes/getNutritionData.js')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(session({secret: 'doodle monkey'}));

app.use('/signup', signup.signupForm);

app.use('/', signup.postSignup);

app.get('/signin', signin.signinForm);

app.post('/signin', signin.signin);

app.use('/home', signin.home);

app.get('/setGoals', setGoals.setGoals);

app.post('/setGoals', setGoals.setGoalsForm);

app.get('/mealPrep', findFood.enterFood);

app.post('/mealPrep', findFood.searchFood);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
