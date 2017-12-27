'use strict';

/**
 * Leads are potential listings (but have not or ever been listed) for eBay store
 */

var r = require('../r');
var schema;
var table = 'listing';
var Joi = require('joi');
var Lead = {};
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
Lead.generateId = function (eBayId, variationSpecifics) {
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
Lead.getAll = function (filters) {
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
Lead.get = function (id) {
    return r
        .table(table)
        .get(id)
        .run();
};

/**
 * Destroy (by id)
 */
Lead.destroy = function (id) {
    return r
        .table(table)
        .get(id)
        .delete()
        .run();
};

/**
 * Create (or update)
 */
Lead.createOrUpdate = function (eBayId, variationSpecifics) {
};

/**
 * Sync all
 */
Lead.sync = function () {

};

/**
 * Refresh (by id)
 */
Lead.refresh = function (id) {

};

/**
 * Edit lead
 */
Lead.edit = function (id, options) {

};

/**
 * List lead
 */
Lead.list = function (id) {

};

/**
 * Reprice lead
 */
Lead.reprice = function (id, price) {

};

module.exports = Lead;

