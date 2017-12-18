'use strict';

var config   = require('./config/app');
var cors     = require('cors');
var express  = require('express'),
    app      = express();
var leads    = require('./routes/leads');
var listings = require('./routes/listings');
var morgan   = require('morgan');
var resales  = require('./routes/resales');
var sales    = require('./routes/sales');
var supplies = require('./routes/supplies');

app.use(cors());
app.use(express.json());
app.use(morgan('[:date[clf]] :method :url :status :res[content-length] - :response-time ms'));
app.use(require('res-error'));

app.use('/leads', leads);
app.use('/listings', listings);
app.use('/resales', resales);
app.use('/sales', sales);
app.use('/supplies', supplies);

app.listen(config.port);
