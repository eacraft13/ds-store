'use strict';

var r = require('../r');
var schema;
var table = 'lead';
var Joi = require('joi');
var Lead = {};
var Resale = require('./resale');

schema = Joi.object().keys({
    createdAt: Joi.date().timestamp('unix').default(Date.now(), 'created at date'),
    resaleId: Joi.string().required()
});

/**
 * Create (or update)
 */
Lead.createOrUpdate = function (lead) {
    var validation = Joi.validate({ resaleId: lead.eBayId }, schema);

    if (validation.error)
        return Promise.reject(new Error(validation.error));

    Resale
    .createOrUpdate(lead)
    .then(function () {
        return new Promise(function (resolve, reject) {
            r
            .table(table)
            .insert(validation.value)
            .run()
            .then(function (result) {
                return resolve(result);
            })
            .error(function (err) {
                return reject(new Error(err));
            });
        });
    });
};

/**
 * Get one (by id)
 */
Lead.getOne = function (id) {
    return new Promise(function (resolve, reject) {
        r
        .table(table)
        .get(id)
        .run()
        .then(function (lead) {
            return resolve(lead);
        })
        .error(function (err) {
            return reject(new Error(err));
        });
    });
};

/**
 * Get all (by query)
 */
Lead.getAll = function (query) {
    return new Promise(function (resolve, reject) {
        r
        .table(table)
        .filter(query || null)
        .run()
        .then(function (cursor) {
            return cursor.toArray();
        })
        .then(function (leads) {
            return resolve(leads);
        })
        .error(function (err) {
            return reject(new Error(err));
        });
    });
};

/**
 * Destroy (by id)
 */
Lead.destroy = function (id) {
    return new Promise(function (resolve, reject) {
        r
        .table(table)
        .get(id)
        .delete()
        .run()
        .then(function (result) {
            return resolve(result);
        })
        .error(function (err) {
            return reject(new Error(err));
        });
    });
};

module.exports = Lead;
