var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

//routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register');
var donateRouter = require('./routes/donate');
var bankRouter = require('./routes/bank');
var logoutRouter = require('./routes/logout');
var loginRouter = require('./routes/login');

//connecting to the database

const url =process.env.DBURI || 'mongodb://localhost:27017/bloodBank';
const connect = mongoose.connect(url,{useNewUrlParser:true , useUnifiedTopology:true});

connect.then((db) => {
  console.log('connected successfully to server :)');

},(err)=>{console.log(err);});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//express sessions
app.use(session({
  name: 'session-id',
  secret: process.env.KEY || 'SUMMERTRAININGINTERNSHIP',
  saveUninitialized: false,
  resave: false,
  store: new FileStore({logFn: function(){}})
}));

function auth (req, res, next) {
  console.log(req.session);

if(!req.session.user) {
    var err = new Error('You are not authenticated!');
    err.status = 403;
    res.redirect('/login');
}
else {
  if (req.session.user === 'authenticated') {
    next();
  }
  else {
    var err = new Error('You are not authenticated!');
    err.status = 403;
    res.redirect('/login');
  }
}
}


//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public/js'));
app.use(express.static('public/css'));
app.use(express.static('public/img'));
app.use(express.static('public/json'));



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login',loginRouter);
app.use('/register', registerRouter);
app.use('/logout', logoutRouter);
app.use(auth);                            //basic authorization
app.use('/donate', donateRouter);
app.use('/bank',bankRouter);




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
