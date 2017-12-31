'use strict';

var Promise = require('bluebird');
var _       = require('lodash');

module.exports = function (req, res, next) {
    res.result = function (result) {
        if (result.errors > 0)
            return res.status(400).json(result);

        if (result.skipped > 0 || result.unchanged > 0)
            return res.status(304).json(result);

        if (result.inserted > 0 || result.replaced > 0)
            return res.status(201).json(result);

        if (result.deleted > 0)
            return res.status(202).json(result);

        return Promise.reject(new Error(JSON.stringify(result)));
    };

    res.results = function (results) {
        if (_.some(results, (result) => result.errors > 0))
            return res.status(400).json(results);

        if (_.every(results, (result) => result.skipped > 0 || result.unchanged > 0))
            return res.status(304).json(results);

        if (_.some(results, (result) => result.inserted > 0 || result.replaced > 0))
            return res.status(201).json(results);

        if (_.some(results, (result) => result.deleted > 0))
            return res.status(202).json(results);

        return Promise.reject(new Error(JSON.stringify(results)));
    };

    next();
};
