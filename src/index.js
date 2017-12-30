'use strict';

var config   = require('./config/server');
var cors     = require('cors');
var express  = require('express'),
    app      = express();
var morgan   = require('morgan');
var r        = require('./r');
var rHandler = require('./util/rHandler');
var resError = require('res-error');

app.use(cors());
app.use(express.json());
app.use(morgan('(:date[clf]) [:method]:url :status (:res[content-length] kbs - :response-time ms)'));
app.use(resError);
app.use(rHandler);

app.use('/leads', require('./routes/leads'));
app.use('/listings', require('./routes/listings'));

app.listen(config.port);

process.on('exit', function () {
    r.getPoolMaster().drain();
});
