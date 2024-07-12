require('dotenv').config()
var express = require('express');
var path = require('path');
var cors = require('cors');
var logger = require('morgan');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var wopiRouter = require('./routes/wopi');
var apiRouter = require('./routes/api');

// maximum request body size handled by the bodyParser package
// increase it if you need to handle larger files
var maxDocumentSize = '200mb';

var app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.raw({limit: maxDocumentSize}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/wopi', wopiRouter);
app.use('/api', apiRouter);

module.exports = app;
