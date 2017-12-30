'use strict';

var Lead    = require('../models/Lead');
var _       = require('lodash');
var express = require('express'),
    router  = express.Router();

/**
 * @index
 */
router.get('/', function (req, res) {
    return Lead
        .getAll()
        .then(function (leads) {
            return res.json(leads);
        })
        .catch(function (err) {
            return res.error(err);
        });
});

/**
 * @createOrUpdate
 */
router.post('/', function (req, res) {
    return Lead
        .createOrUpdate(req.body)
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
 * @sync
 */
router.put('/sync', function (req, res) {
    return Lead
        .sync()
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
router.get('/:lead_id', function (req, res) {
    return Lead
        .get(req.params.lead_id)
        .then(function (lead) {
            return res.json(lead || {});
        })
        .catch(function (err) {
            return res.error(err);
        });
});

/**
 * @destroy
 */
router.delete('/:lead_id', function (req, res) {
    return Lead
        .destroy(req.params.lead_id)
        .then(function (result) {
            if (result.errors > 0)
                res.error(400, result.first_error);

            if (result.skipped > 0 || result.unchanged > 0)
                return res.status(202).json(result);

            if (result.deleted > 0)
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
router.put('/:lead_id/refresh', function (req, res) {
    return Lead
        .refresh(req.params.lead_id)
        .then(function (result) {
            if (result.errors > 0)
                return res.error(400, result.first_error);

            if (result.skipped > 0 || result.unchanged > 0)
                return res.status(201).json(result);

            if (result.inserted > 0 || result.replaced > 0)
                return res.status(201).json(result);

            return Promise.reject(new Error (result));
        })
        .catch(function (err) {
            return res.error(err);
        });
});

/**
 * @list
 */
router.patch('/:lead_id/list', function (req, res) {
    return res.status(202).json();
});

module.exports = router;
