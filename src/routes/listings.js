'use strict';

var Listing = require('../models/Listing');
var Snipe   = require('../models/Snipe');
var Supply  = require('../models/Supply');
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

            if (result.inserted > 0 || result.replaced > 0 || result.skipped > 0 || result.unchanged > 0)
                return res.status(201).json(result);

            return res.error(501, result);
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
            var errors = _.filter(results, function (result) {
                return result.errors > 0;
            });

            if (errors.length > 0)
                return res.error(400, _.map(results, function (result) {
                    return result.first_error;
                }).join(';'));

            if (
                _.every(results, function (result) {
                    return result.inserted > 0 || result.replaced > 0 || result.skipped > 0 || result.unchanged > 0;
                })
            )
                return res.status(201).json(results);

            return res.error(501, results);
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
            return res.json(listing);
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
            return res.status(202).json(result);
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

            if (result.inserted > 0 || result.replaced > 0 || result.skipped > 0 || result.unchanged > 0)
                return res.status(201).json(result);

            return res.error(501, result);
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

/**
 * supplies@createOrUpdate
 */
router.post('/:listing_id/supplies', function (req, res) {
    return res.status(201).json();
});

/**
 * supplies@destroy
 */
router.post('/:listing_id/supplies/:supply_id', function (req, res) {
    return res.status(202).json();
});

/**
 * supplies@refresh
 */
router.put('/:listing_id/supplies/:supply_id', function (req, res) {
    return res.status(201).json();
});

/**
 * snipes@createOrUpdate
 */
router.post('/:listing_id/snipes', function (req, res) {
    return res.status(201).json();
});

/**
 * snipes@destroy
 */
router.post('/:listing_id/snipes/:supply_id', function (req, res) {
    return res.status(202).json();
});

/**
 * snipes@refresh
 */
router.put('/:listing_id/snipes/:supply_id', function (req, res) {
    return res.status(201).json();
});

module.exports = router;

/**********************************************************/

/**
 * @index
 */
router.get('/', function (req, res) {
    return Listing.getAll()
        .then(function (listings) {
            return res.json(listings);
        })
        .catch(function (err) {
            return res.error(err);
        });
});

/**
 * @create
 */
router.post('/', function (req, res) {
    return Listing.createOrUpdate(req.body)
        .then(function (result) {
            if (result.errors > 0)
                return res.error(400, result.first_error);

            if (result.inserted > 0)
                return res.status(201).json();

            if (result.replaced > 0 || result.skipped > 0 || result.unchanged > 0)
                return res.status(204).json();

            return res.error(501, 'Unknown error');
        })
        .catch(function (err) {
            return res.error(err);
        });
});

/**
 * @show
 */
router.get('/:id', function (req, res) {
    return Listing.getOne(req.params.id)
        .then(function (listing) {
            return res.json(listing);
        })
        .catch(function (err) {
            return res.error(err);
        });
});
