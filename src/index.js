'use strict';

var config   = require('./config/app');
var cors     = require('cors');
var express  = require('express'),
    app      = express();
var listings = require('./routes/listings');
var morgan   = require('morgan');
var r        = require('./r');

app.use(cors());
app.use(express.json());
app.use(morgan('(:date[clf]) [:method]:url :status (:res[content-length] kbs - :response-time ms)'));
app.use(require('res-error'));

app.use('/listings', listings);

app.listen(config.port);

process.on('exit', function () {
    r.getPoolMaster().drain();
});
