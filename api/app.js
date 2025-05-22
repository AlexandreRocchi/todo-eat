var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Accepter les connexions depuis le frontend en développement et en production
app.use(cors({ 
  origin: ['http://localhost:5173'],
  credentials: true 
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
