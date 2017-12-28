'use strict';

var Supply   = require('../models/Supply');
var _       = require('lodash');
var express = require('express'),
    router  = express.Router();
var url     = require('url');

/**
 * @index
 */
router.get('/', function (req, res) {
    return Supply
        .getAll(req.resale.supplies)
        .then(function (supplies) {
            return res.json(supplies);
        })
        .catch(function (err) {
            return res.error(err);
        });
});

/**
 * @createOrUpdate
 */
router.post('/', function (req, res) {
    return Supply
        .createOrUpdate(req.body)
        .then(function (result) {
            if (result.errors > 0)
                return result;

            if (result.inserted > 0 || result.replaced > 0 || result.skipped > 0 || result.unchanged > 0) {
                req.resale.supplies = _.union(req.resale.supplies, _.map(result.changes, function (change) {
                    return change.new_val.id;
                }));

                return req.model.createOrUpdate(req.resale);
            }

            return Promise.reject(new Error(result));
        })
        .then(function (result) {
            if (result.errors > 0)
                return res.error(400, result.first_error);

            if (result.skipped > 0 || result.unchanged > 0)
                return res.status(201).json(result);

            if (result.inserted > 0 || result.replaced > 0)
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
    var supplyId;
    var supplyUrl = url.parse(req.body.url);

    supplyId = supplyUrl.pathname.split('/')[2];

    return Supply
        .add(supplyId)
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

                req.resale.supplies = _.union(req.resale.supplies, changes);

                return req.model.createOrUpdate(req.resale);
            }

            return Promise.reject(new Error(results));
        })
        .then(function (results) {
            var errors, isSuccess;

            if (!Array.isArray(results))
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
    var supplyId;
    var supplyUrl = url.parse(req.body.url);

    supplyId = supplyUrl.pathname.split('/')[2];

    return Supply
        .remove(supplyId)
        .then(function (ids) {
            req.resale.supplies = _.difference(req.resale.supplies, ids);
            return req.model.createOrUpdate(req.resale);
        })
        .then(function (result) {
            if (result.errors > 0)
                return res.error(400, result.first_error);

            if (result.skipped > 0 || result.unchanged > 0)
                return res.status(202).json(result);

            if (result.inserted > 0 || result.replaced > 0)
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
    return Supply
        .sync(req.resale.supplies)
        .then(function (results) {
            var errors, isSuccess;

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
 * @show
 */
router.get('/:supply_id', function (req, res) {
    var ids = _.intersection(req.resale.supplies, [req.params.supply_id]);

    return Supply
        .get(ids.length ? ids[0] : '')
        .then(function (supply) {
            return res.json(supply || {});
        })
        .catch(function (err) {
            return res.error(err);
        });
});

/**
 * @destroy
 */
router.delete('/:supply_id', function (req, res) {
    return Supply
        .destroy(_.intersection(req.resale.supplies, [req.params.supply_id]))
        .then(function (result) {
            if (result.errors > 0)
                return result;

            req.resale.supplies = _.difference(req.resale.supplies, [req.params.supply_id]);
            return req.model.createOrUpdate(req.resale);
        })
        .then(function (result) {
            if (result.errors > 0)
                return res.error(400, result.first_error);

            if (result.skipped > 0 || result.unchanged > 0)
                return res.status(202).json(result);

            if (result.inserted > 0 || result.replaced > 0)
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
router.put('/:supply_id/refresh', function (req, res) {
    var ids = _.intersection(req.resale.supplies, [req.params.supply_id]);

    return Supply
        .refresh(ids[0])
        .then(function (result) {
            if (result.errors > 0)
                return res.error(400, result.first_error);

            if (Array.isArray(result) && result.length === 0)
                return res.error(400, result);

            if (result.skipped > 0 || result.unchanged > 0)
                return res.status(201).json(result);

            if (result.inserted > 0 || result.replaced > 0)
                return res.status(201).json(result);

            return Promise.reject(new Error(result));
        })
        .catch(function (err) {
            return res.error(err);
        });
});

module.exports = router;
