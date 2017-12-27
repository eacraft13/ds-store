'use strict';

/**
 * Snipes are listings from other eBay stores
 */

var r = require('../r');
var hash = require('object-hash');
var schema;
var table = 'snipes';
var Joi = require('joi');
var Promise = require('bluebird');
var Snipe = {};

schema = Joi.object().keys({
    id: Joi.string().required(),

    eBay: Joi.object().keys({
        finding: Joi.object().allow(null),
        shopping: Joi.object().required(),
    }),

    createdAt: Joi.date().timestamp('unix').default(Date.now(), 'created at date'),
    updatedAt: Joi.date().timestamp('unix').default(Date.now(), 'updated at date'),
});

/**
 * Generates id
 */
Snipe.generateId = function (eBayId, variationSpecifics) {
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
Snipe.getAll = function (filters) {
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
Snipe.createOrUpdate = function (eBayId, variationSpecifics) {
};

/**
 * Sync all
 */
Snipe.sync = function () {

};

/**
 * Refresh (by id)
 */
Snipe.refresh = function (id) {

};

module.exports = Snipe;

