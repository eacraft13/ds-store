'use strict';

var conf     = require('./config/app');
var express  = require('express'),
    app      = express();
var leads    = require('./routes/leads');
var resales  = require('./routes/resales');
var supplies = require('./routes/supplies');

app.use(require('res-error'));

app.use('/leads', leads);
app.use('/resales', resales);
app.use('/supplies', supplies);

app.listen(conf.port);
