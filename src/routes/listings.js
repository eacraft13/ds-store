'use strict';

var Listing  = require('../models/Resale')('listings'),
    Snipe    = require('../models/Snipe')(Listing),
    Supply   = require('../models/Supply')(Listing);
var _        = require('lodash');
var ebay     = require('ebay-dev-api')(require('../../private/ebay'));
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
    return ebay
        .finding
        .findItemsIneBayStores({ storeName: ebay.storeName })
        .then(function (items) {
            return _.map(items[0].item, function (item) {
                return {
                    ebay: {
                        finding: item
                    }
                };
            });
        })
        .then(function (listings) {
            var ids = _.map(listings, function (listing) {
                return listing.ebay.finding.itemId[0];
            });

            return ebay
                .shopping
                .getMultipleItems(ids)
                .then(function (items) {
                    return _.map(listings, function (listing) {
                        listing.ebay.shopping = _.find(items, { ItemID: listing.ebay.finding.itemId[0] });
                        return listing;
                    });
                });
        })
        .then(function (listings) {
            return _.uniqBy(listings, 'ebay.shopping.ItemID');
        })
        .then(function (listings) {
            return _(listings)
                .map(function (listing) {
                    var variations = ebay.shopping.explodeVariations(listing.ebay.shopping);

                    return _.map(variations, function (variation) {
                        var clone = _.cloneDeep(listing);

                        clone.id = ebay.shopping.generateId(variation);
                        clone.ebay.shopping = variation;

                        return clone;
                    });
                })
                .flatten()
                .valueOf();
        })
        .then(function (listings) {
            return Promise
                .all(
                    _.map(listings, function (listing) {
                        return Listing.createOrUpdate(listing);
                    })
                );
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
