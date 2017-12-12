'use strict';

var conf = require('./config/db'),
    thinky = require('thinky')(conf);

module.exports = thinky;
