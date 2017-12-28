'use strict';

var Listing = require('../models/Listing');
var _       = require('lodash');
var express = require('express'),
    router  = express.Router();

/**
 * @index
 */
router.get('/', function (req, res) {
    return Listing
        .getAll()
        .then(function (listings) {
            return res.json(listings);
        })
        .catch(function (err) {
            return res.error(err);
        });
});

/**
 * @createOrUpdate
 */
router.post('/', function (req, res) {
    return Listing
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
    return Listing
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
router.get('/:listing_id', function (req, res) {
    return Listing
        .get(req.params.listing_id)
        .then(function (listing) {
            return res.json(listing || {});
        })
        .catch(function (err) {
            return res.error(err);
        });
});

/**
 * @destroy
 */
router.delete('/:listing_id', function (req, res) {
    return Listing
        .destroy(req.params.listing_id)
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
router.put('/:listing_id/refresh', function (req, res) {
    return Listing
        .refresh(req.params.listing_id)
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
 * @edit
 */
router.patch('/:listing_id/edit', function (req, res) {
    return res.status(202).json();
});

/**
 * @activate
 */
router.patch('/:listing_id/activate', function (req, res) {
    return res.status(202).json();
});

/**
 * @end
 */
router.patch('/:listing_id/end', function (req, res) {
    return res.status(202).json();
});

/**
 * @reprice
 */
router.patch('/:listing_id/reprice', function (req, res) {
    return res.status(202).json();
});

module.exports = router;
