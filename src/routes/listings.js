'use strict';

var Listing  = require('../models/Resale')('listings'),
    Snipe    = require('../models/Snipe')(Listing),
    Supply   = require('../models/Supply')(Listing);
var _        = require('lodash');
var ds       = require('ds-client');
var express  = require('express'),
    router   = express.Router();
var resales  = require('./_resales');
var snipes   = require('./snipes');
var supplies = require('./supplies');

router.use('/', resales(Listing));
router.use('/:id/snipes', function (req, res, next) {
    req.resaleId = req.params.id;
    next();
}, snipes(Snipe));
router.use('/:id/supplies', function (req, res, next) {
    req.resaleId = req.params.id;
    next();
}, supplies(Supply));

/**
 * @sync
 */
router.put('/sync', function (req, res) {
    return ds
        .ebay
        .getListings()
        .then(function (listings) {
            var promises = _.map(listings, function (listing) {
                return Listing.createOrUpdate(listing);
            });

            return Promise.all(listing);
        })
        .then(function (results) {
            return res.results(results);
        })
        .catch(function (err) {
            return res.error(err);
        });
});

/**
 * @edit
 */
router.put('/:id/edit', function (req, res) {
    var id = req.params.id;

    return res.send('WIP');
});

/**
 * @relist
 */
router.post('/:id/relist', function (req, res) {
    var id = req.params.id;

    return res.send('WIP');
});

module.exports = router;
