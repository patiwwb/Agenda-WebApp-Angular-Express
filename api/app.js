var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const config = require('./config');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

MongoClient.connect(`mongodb://${config.dbHost}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    const db = client.db(config.dbName);
    const collectionA = db.collection(config.dbCollectionA);    
    app.locals[config.dbCollectionA] = collectionA;
    const collectionR = db.collection(config.dbCollectionR);    
    app.locals[config.dbCollectionR] = collectionR;
  })
  .catch(error => {
    console.log(error);
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use((req, res, next) => {
  const collectionA = req.app.locals[config.dbCollectionA];
  req.collectionA = collectionA;
  const collectionR = req.app.locals[config.dbCollectionR];
  req.collectionR = collectionR;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
