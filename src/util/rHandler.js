'use strict';

var Promise = require('bluebird');
var _       = require('lodash');

module.exports = function () {
    return function (req, res) {
        res.result = function (result) {
            if (result.errors > 0)
                return res.status(400).json(result);

            if (result.skipped > 0 || result.unchanged > 0)
                return res.status(304).json(result);

            if (result.inserted > 0 || result.replaced > 0)
                return res.status(201).json(result);

            return Promise.reject(new Error(result));
        };

        res.results = function (results) {
            if (_.some(results, (result) => result.errors > 0))
                return res.status(400).json(results);

            if (_.every(results, (result) => result.skipped > 0 || result.unchanged > 0))
                return res.status(304).json(results);

            if (_.some(results, (result) => result.inserted > 0 || result.replaced > 0))
                return res.status(201).json(results);

            return Promise.reject(new Error(results));
        };
    };
};
