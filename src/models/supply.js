'use strict';

/**
 * Supplies are actual or potential items to drop ship from a merchant
 */

var r = require('../r');
var schema;
var table = 'listing';
var Joi = require('joi');
var Promise = require('bluebird');
var Supply = {};

schema = Joi.object().keys({
    id: Joi.string().required(),

    data: Joi.object().allow(null),
    merchantId: Joi.string().required(),
    merchantName: Joi.string().required(),

    createdAt: Joi.date().timestamp('unix').default(Date.now(), 'created at date'),
    updatedAt: Joi.date().timestamp('unix').default(Date.now(), 'updated at date'),
});

/**
 * Generates id
 */
Supply.generateId = function (merchantName, merchantId) {
    return `${merchantName.toLowerCase()}-${merchantId}`;
};

/**
 * Get all
 */
Supply.getAll = function (filters) {
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
Supply.get = function (id) {
    return r
        .table(table)
        .get(id)
        .run();
};

/**
 * Destroy (by id)
 */
Supply.destroy = function (id) {
    return r
        .table(table)
        .get(id)
        .delete()
        .run();
};

/**
 * Create (or update)
 */
Supply.createOrUpdate = function (apiName, apiId) {
};

/**
 * Sync all
 */
Supply.sync = function () {

};

/**
 * Refresh (by id)
 */
Supply.refresh = function (id) {

};

module.exports = Supply;

