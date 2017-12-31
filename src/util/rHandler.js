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
        var result = _.reduce(results, function (val, memo) {
            return {
                deleted:   memo.deleted   + +val.deleted || 0,
                errors:    memo.errors    + +val.errors || 0,
                inserted:  memo.inserted  + +val.inserted || 0,
                replaced:  memo.replaced  + +val.replaced || 0,
                skipped:   memo.skipped   + +val.skipped || 0,
                unchanged: memo.unchanged + +val.unchanged || 0
            };
        }, {
            deleted: 0,
            errors: 0,
            inserted: 0,
            replaced: 0,
            skipped: 0,
            unchanged: 0
        });

        return res.result(result);
    };

    next();
};
