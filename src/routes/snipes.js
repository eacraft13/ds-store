'use strict';

var Snipe   = require('../models/Snipe');
var _       = require('lodash');
var ebay    = require('ebay-dev-api')(require('../../private/ebay'));
var express = require('express'),
    router  = express.Router();
var url     = require('url');

/**
 * @index
 */
router.get('/', function (req, res) {
    return Snipe
        .getAll(req.resale.snipes)
        .then(function (snipes) {
            return res.json(snipes);
        })
        .catch(function (err) {
            return res.error(err);
        });
});

/**
 * @createOrUpdate
 */
router.post('/', function (req, res) {
    return Snipe
        .createOrUpdate(req.body)
        .then(function (result) {
            if (result.errors > 0)
                return result;

            if (result.inserted > 0 || result.replaced > 0 || result.skipped > 0 || result.unchanged > 0) {
                req.resale.snipes = _.union(
                    req.resale.snipes,
                    _.map(result.changes, function (change) {
                        return change.new_val.id;
                    })
                );

                return req.model.createOrUpdate(req.resale);
            }

            return Promise.reject(new Error(result));
        })
        .then(function (result) {
            if (result.errors > 0)
                return res.error(400, result.first_error);

            if (result.inserted > 0 || result.replaced > 0 || result.skipped > 0 || result.unchanged > 0)
                return res.status(201).json(result);

            return Promise.reject(new Error(result));
        })
        .catch(function (err) {
            return res.error(err);
        });
});

/**
 * @add
 */
router.post('/add', function (req, res) {
    var snipeId;
    var snipeUrl = url.parse(req.body.url);

    snipeId = snipeUrl.pathname.split('/')[2];

    return Snipe
        .add(snipeId)
        .then(function (results) {
            var changes, errors, isSuccess;

            errors = _.filter(results, function (result) {
                return result.errors > 0;
            });

            if (errors.length > 0)
                return results;

            isSuccess = _.every(results, function (result) {
                return result.inserted > 0 || result.replaced > 0 || result.skipped > 0 || result.unchanged > 0;
            });

            if (isSuccess) {
                changes = _(results)
                    .map(function (result) {
                        return _.map(result.changes, function (change) {
                            return change.new_val.id;
                        });
                    })
                    .flatten()
                    .valueOf();

                req.resale.snipes = _.union(req.resale.snipes, changes);

                return req.model.createOrUpdate(req.resale);
            }

            return Promise.reject(new Error(results));
        })
        .then(function (results) {
            var errors, isSuccess;

            if (!Array.isArray)
                results = [results];

            errors = _.filter(results, function (result) {
                return result.errors > 0;
            });

            if (errors.length > 0)
                return res.error(400, _.map(results, 'first_error'));

            isSuccess = _.every(results, function (result) {
                return result.inserted > 0 || result.replaced > 0 || result.skipped > 0 || result.unchanged > 0;
            });

            if (isSuccess)
                return res.status(201).json(results);

            return Promise.reject(new Error(results));
        })
        .catch(function (err) {
            return res.error(err);
        });
});

/**
 * @remove
 */
router.delete('/remove', function (req, res) {
    var snipeId;
    var snipeUrl = url.parse(req.body.url);

    snipeId = snipeUrl.pathname.split('/')[2];

    return ebay
        .shopping
        .getMultipleItems([snipeId])
        .then(function (items) {
            return _(items)
                .map(function (item) {
                    var variations = ebay.shopping.explodeVariations(item);

                    return _.map(variations, function (variation) {
                        return ebay.shopping.generateId(variation);
                    });
                })
                .flatten()
                .valueOf();
        })
        .then(function (ids) {
            return req.resale.snipes = _.difference(req.resale.snipes, ids);
        })
        .then(function () {
            return req.model.createOrUpdate(req.resale);
        })
        .then(function (result) {
            if (result.errors > 0)
                return res.error(400, result.first_error);

            if (result.inserted > 0 || result.replaced > 0 || result.skipped > 0 || result.unchanged > 0)
                return res.status(202).json(result);

            return Promise.reject(new Error(result));
        })
        .catch(function (err) {
            return res.error(err);
        });
});

/**
 * @sync
 */
router.put('/sync', function (req, res) {
    return Snipe
        .sync(req.resale.snipes)
        .then(function (result) {
            if (result.errors > 0)
                return result;

            if (Array.isArray(result) && result.length === 0)
                return result;

            if (result.inserted > 0 || result.replaced > 0 || result.skipped > 0 || result.unchanged > 0) {
                req.resale.snipes = _.union(
                    req.resale.snipes,
                    _.map(result.changes, function (change) {
                        return change.new_val.id;
                    })
                );

                return req.model.createOrUpdate(req.resale);
            }

            return Promise.reject(new Error(result));
        })
        .then(function (result) {
            if (result.errors > 0)
                return res.error(400, result.first_error);

            if (Array.isArray(result) && result.length === 0)
                return res.error(400);

            if (result.inserted > 0 || result.replaced > 0 || result.skipped > 0 || result.unchanged > 0)
                return res.status(201).json(result);

            return Promise.reject(new Error(result));
        })
        .catch(function (err) {
            return res.error(err);
        });
});

/**
 * @show
 */
router.get('/:snipe_id', function (req, res) {
    return Snipe
        .get(req.params.snipe_id)
        .then(function (snipe) {
            if (!snipe || !_.includes(req.resale.snipes, snipe.id))
                return res.error(400, snipe);

            return res.json(snipe);
        })
        .catch(function (err) {
            return res.error(err);
        });
});

/**
 * @destroy
 */
router.delete('/:snipe_id', function (req, res) {
    return Snipe
        .destroy(req.params.snipe_id)
        .then(function (result) {
            if (result.errors > 0)
                return result;

            return req.resale.snipes = _.difference(req.resale.snipes, [req.params.snipe_id]);
        })
        .then(function (result) {
            if (result.errors > 0)
                return result;

            return req.model.createOrUpdate(req.resale);
        })
        .then(function (result) {
            if (result.errors > 0)
                return res.error(400, result.first_error);

            if (result.inserted > 0 || result.replaced > 0 || result.skipped > 0 || result.unchanged > 0)
                return res.status(202).json(result);

            return Promise.reject(new Error(result));
        })
        .catch(function (err) {
            return res.error(err);
        });
});

/**
 * @refresh
 */
router.put('/:snipe_id/refresh', function (req, res) {
    return res.status(202).json();
});

module.exports = router;
