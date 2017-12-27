/**
 * Listings are products that were once or currently listed (i.e. active or inactive) on eBay store
 */

'use strict';

var Joi     = require('joi');
var Listing = {};
var Promise = require('bluebird');
var _       = require('lodash');
var ebay    = require('ebay-dev-api')(require('../../private/ebay'));
var r       = require('../r');
var schema;
var table   = 'listings';

/**
 * Listing schema
 */
schema = Joi.object().keys({
    id: Joi.string().required(),

    ebay: Joi.object().keys({
        finding: Joi.object().allow(null),
        shopping: Joi.object().required(),
    }),

    snipes: Joi.array().items(Joi.string()).default([]), // [snipe_id]
    supplies: Joi.array().items(Joi.string()).default([]), // [supply_id]

    createdAt: Joi.date().timestamp('unix').default(Date.now, 'time of creation'),
    updatedAt: Joi.date().timestamp('unix').default(Date.now, 'time of update'),
});

/**
 * Get all
 */
Listing.getAll = function (filters) {
    var query = r.table(table);

    if (filters)
        query.filter(filters);

    return query
        .run();
        //todo - join snipes and supplies
};

/**
 * Get (by id)
 */
Listing.get = function (id) {
    return r
        .table(table)
        .get(id)
        .run();
        // todo - join snipes and supplies
};

/**
 * Destroy (by id)
 */
Listing.destroy = function (id) {
    return r
        .table(table)
        .get(id)
        .delete()
        .run();
};

/**
 * Create (or update)
 */
Listing.createOrUpdate = function (listing) {
    var joi;

    listing.id = ebay.shopping.generateId(listing.ebay.shopping);
    joi = Joi.validate(listing, schema);

    if (joi.error)
        Promise.reject(new Error(joi.error));

    return r
        .table(table)
        .insert(joi.value, {
            conflict: function (id, oldDoc, newDoc) {
                return oldDoc.merge(newDoc, { updatedAt: Date.now() });
            }
        })
        .run();
};

/**
 * Sync all
 */
Listing.sync = function () {
    var self = this;

    return ebay
        .finding
        .findItemsIneBayStores({ storeName: ebay.storeName })
        .then(function (listings) {
            var ids = _(listings[0].item)
                .map(function (listing) {
                    return listing.itemId[0];
                })
                .uniq()
                .valueOf();

            return ebay
                .shopping
                .getMultipleItems(ids)
                .then(function (items) {
                    return _.map(items, function (item) {
                        var listing = _.find(listings[0].item, { itemId: [item.ItemID] });

                        return {
                            ebay: {
                                finding: listing,
                                shopping: item
                            }
                        };
                    });
                });
        })
        .then(function (listings) {
            return _(listings)
                .map(function (listing) {
                    var variations = ebay.shopping.explodeVariations(listing.ebay.shopping);

                    return _.map(variations, function (variation) {
                        var clone = _.cloneDeep(listing);

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
                        return self.createOrUpdate(listing);
                    })
                );
        });

};

/**
 * Refresh (by id)
 */
Listing.refresh = function (id) {
    var explodedId = ebay.shopping.explodeId(id);
    var self = this;

    return ebay
        .finding
        .findItemsIneBayStores({ storeName: ebay.storeName })
        .then(function (listings) {
            var listing = _.find(listings[0].item, function (l) {
                return l.itemId[0] === explodedId.itemId;
            });

            return ebay
                .shopping
                .getMultipleItems([explodedId.itemId])
                .then(function (items) {
                    return {
                        ebay: {
                            finding: listing,
                            shopping: items[0]
                        }
                    };
                });
        })
        .then(function (listing) {
            var variation = ebay.shopping.getVariation(listing.ebay.shopping, explodedId.variationHash);

            listing.ebay.shopping = variation;

            return listing;
        })
        .then(function (listing) {
            return self.createOrUpdate(listing);
        });
};

/**
 * Edit listing
 */
Listing.edit = function (id, options) {

};

/**
 * End listing
 */
Listing.end = function (id) {

};

/**
 * Activate listing
 */
Listing.activate = function (id) {

};

/**
 * Reprice listing
 */
Listing.reprice = function (id, price) {

};

module.exports = Listing;

