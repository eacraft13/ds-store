/**
 * Listings are products that were once or currently listed (i.e. active or inactive) on eBay store
 */

'use strict';

var Joi     = require('joi');
var Listing = {};
var Promise = require('bluebird');
var _       = require('lodash');
var ebay    = require('ebay-dev-api')(require('../../private/ebay'));
var hash    = require('object-hash');
var r       = require('../r');
var schema;
var table   = 'listing';

/**
 * Listing schema
 */
schema = Joi.object().keys({
    id: Joi.string().required(),

    eBay: Joi.object().keys({
        finding: Joi.object().allow(null),
        shopping: Joi.object().required(),
    }),

    snipes: Joi.array().items(Joi.string()).default([]), // [snipe_id]
    supplies: Joi.array().items(Joi.string()).default([]), // [supply_id]

    createdAt: Joi.date().timestamp('unix').default(Date.now, 'time of creation'),
    updatedAt: Joi.date().timestamp('unix').default(Date.now, 'time of update'),
});

/**
 * Generates id
 */
Listing.generateId = function (eBayId, variationSpecifics) {
    var id;

    if (variationSpecifics)
        id = hash.MD5(variationSpecifics);
    else
        id = 0;

    return `${eBayId}-${id}`;
};

/**
 * Get all
 */
Listing.getAll = function (filters) {
    var query = r.table(table);

    if (filters)
        query.filter(filters);

    return query
        .run()
        .then(function (cursor) {
            return cursor.toArray();
        });
};

/**
 * Get (by id)
 */
Listing.get = function (id) {
    return r
        .table(table)
        .get(id)
        .run();
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
    var joi = Joi.validate(listing, schema);

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
                    return _.map(listings[0].item, function (listing) {
                        var item = _.find(items, { ItemID: listing.itemId[0] });

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
            return _.uniqBy(listings, function (listing) {
                return listing.ebay.shopping.ItemID;
            });
        })
        .then(function (listings) {
            return _(listings)
                .map(function (listing) {
                    var variations = ebay.shopping.explodeVariations(listing.ebay.shopping);

                    return _.map(variations, function (variation) {
                        return _.assign({}, listing, { ebay: { shopping: variation } });
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

