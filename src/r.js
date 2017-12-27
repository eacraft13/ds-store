'use strict';

var config = require('./config/db'),
    r = require('rethinkdbdash')({
        buffer: 2,
        cursor: false,
        db: config.db,
        host: config.host,
        max: 5,
        pool: true,
        port: config.port
    });

module.exports = r;
