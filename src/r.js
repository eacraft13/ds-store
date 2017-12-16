'use strict';

var config = require('./config/db'),
    r = require('rethinkdbdash')({
        cursor: true,
        db: config.db,
        host: config.host,
        pool: true,
        port: config.port
    });

module.exports = r;
