/**
 * Snipes are listings from other eBay stores
 */

'use strict';

var Joi     = require('joi');
var Promise = require('bluebird');
var Snipe   = {};
var _       = require('lodash');
var ebay    = require('ebay-dev-api')(require('../../private/ebay'));
var r       = require('../r');
var schema;
var table   = 'snipes';

/**
 * Snipe schema
 */
schema = Joi.object().keys({
    id: Joi.string().required(),

    ebay: Joi.object().keys({
        finding: Joi.object().allow(null),
        shopping: Joi.object().required(),
    }),

    createdAt: Joi.date().timestamp('unix').default(Date.now(), 'created at date'),
    updatedAt: Joi.date().timestamp('unix').default(Date.now(), 'updated at date'),
});

/**
 * Get all
 */
Snipe.getAll = function (filters) {
    if (Array.isArray(filters) && filters.length === 0)
        return r
            .table(table)
            .filter(null)
            .run();

    if (filters)
        return r
            .table(table)
            .filter(filters)
            .run();

    return r
        .table(table)
        .run();
};

/**
 * Get (by id)
 */
Snipe.get = function (id) {
    return r
        .table(table)
        .get(id)
        .run();
};

/**
 * Destroy (by id)
 */
Snipe.destroy = function (id) {
    return r
        .table(table)
        .get(id)
        .delete()
        .run();
};

/**
 * Create (or update)
 */
Snipe.createOrUpdate = function (snipe) {
    var joi;

    delete snipe.createdAt;
    delete snipe.updatedAt;

    snipe.id = ebay.shopping.generateId(snipe.ebay.shopping);
    joi = Joi.validate(snipe, schema);

    if (joi.error)
        return Promise.reject(new Error(joi.error));

    return r
        .table(table)
        .insert(joi.value, {
            conflict: function (id, oldDoc, newDoc) {
                return oldDoc.merge(newDoc, { updatedAt: Date.now() });
            },
            returnChanges: true
        })
        .run();
};

/**
 * Add (by itemId)
 */
Snipe.add = function (itemId) {
    var self = this;

    return ebay
        .shopping
        .getMultipleItems([itemId])
        .then(function (items) {
            return _.map(items, function (item) {
                return {
                    ebay: {
                        shopping: item
                    }
                };
            });
        })
        .then(function (resales) {
            return _(resales)
                .map(function (resale) {
                    var variations = ebay.shopping.explodeVariations(resale.ebay.shopping);

                    return _.map(variations, function (variation) {
                        var clone = _.cloneDeep(resale);

                        clone.ebay.shopping = variation;

                        return clone;
                    });
                })
                .flatten()
                .valueOf();
        })
        .then(function (resales) {
            return Promise
                .all(
                    _.map(resales, function (resale) {
                        return self.createOrUpdate(resale);
                    })
                );
        });
};

/**
 * Remove (by itemId)
 */
Snipe.remove = function (itemId) {
    return ebay
        .shopping
        .getMultipleItems([itemId])
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
        });
};

/**
 * Sync all
 */
Snipe.sync = function (ids) {
    var explodedIds;
    var self = this;

    explodedIds = _.map(ids, function (id) {
        return ebay.shopping.explodeId(id);
    });

    return ebay
        .shopping
        .getMultipleItems(_.map(explodedIds, 'itemId'))
        .then(function (items) {
            return _.map(items, function (item) {
                return {
                    ebay: {
                        shopping: item
                    }
                };
            });
        })
        .then(function (resales) {
            return _(resales)
                .map(function (resale) {
                    var resaleId, variation;

                    resaleId = _.find(explodedIds, function (explodedId) {
                        return explodedId.itemId = resale.ebay.shopping.ItemID;
                    });
                    variation = ebay.shopping.getVariation(resale.ebay.shopping, resaleId.variationHash);

                    resale.ebay.shopping = variation;

                    return resale;
                })
                .valueOf();
        })
        .then(function (resales) {
            return Promise
                .all(
                    _.map(resales, function (resale) {
                        return self.createOrUpdate(resale);
                    })
                );
        });
};

/**
 * Refresh (by id)
 */
Snipe.refresh = function (id) {
    var explodedId;
    var self = this;

    if (!id)
        return Promise.resolve({ unchanged: 1 });

    explodedId = ebay.shopping.explodeId(id);

    return ebay
        .shopping
        .getMultipleItems([explodedId.itemId])
        .then(function (items) {
            return {
                ebay: {
                    shopping: items[0]
                }
            };
        })
        .then(function (snipe) {
            var variation = ebay.shopping.getVariation(snipe.ebay.shopping, explodedId.variationHash);

            snipe.ebay.shopping = variation;

            return snipe;
        })
        .then(function (snipe) {
            return self.createOrUpdate(snipe);
        });
};

module.exports = Snipe;

