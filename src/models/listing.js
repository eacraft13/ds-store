'use strict';

/**
 * Listings are products that were once or currently listed (i.e. active or inactive) on eBay store
 */

var r = require('../r');
var hash = require('object-hash');
var schema;
var table = 'listing';
var Joi = require('joi');
var Listing = {};
var Promise = require('bluebird');

schema = Joi.object().keys({
    id: Joi.string().required(),

    eBay: Joi.object().keys({
        finding: Joi.object().allow(null),
        shopping: Joi.object().required(),
    }),

    snipes: Joi.array().items(Joi.string()), // [snipe_id]
    supplies: Joi.array().items(Joi.string()), // [supply_id]

    createdAt: Joi.date().timestamp('unix').default(Date.now(), 'created at date'),
    updatedAt: Joi.date().timestamp('unix').default(Date.now(), 'updated at date'),
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
Listing.createOrUpdate = function (eBayId, variationSpecifics) {
};

/**
 * Sync all
 */
Listing.sync = function () {

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

