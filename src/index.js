'use strict';

var config   = require('./config/app');
var express  = require('express'),
    app      = express();
var leads    = require('./routes/leads');
var resales  = require('./routes/resales');
var supplies = require('./routes/supplies');

app.use(express.json());
app.use(require('res-error'));

app.use('/leads', leads);
app.use('/resales', resales);
app.use('/supplies', supplies);

app.listen(config.port);
