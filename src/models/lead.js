'use strict';

var r = require('../r');
var schema;
var table = 'lead';
var Joi = require('joi');
var Lead = {};
var Resale = require('./resale');

schema = Joi.object().keys({
    createdAt: Joi.date().timestamp('unix').default(Date.now(), 'created at date'),
    resaleId: Joi.string().required(),
    updatedAt: Joi.date().timestamp('unix').default(Date.now(), 'updated at date'),
});

/**
 * Create (or update)
 */
Lead.createOrUpdate = function (resale) {
    return Resale
        .createOrUpdate(resale)
        .then(function (result) {
            if (result.errors > 0)
                return Promise.resolve(result);

            return new Promise(function (resolve, reject) {
                var lead;

                Joi.validate({ resaleId: resale.eBayId }, schema, function (err, value) {
                    if (err)
                        return reject(new Error(err));
                    lead = value;
                });

                r
                .table(table)
                .insert(lead, {
                    conflict: function (id, oldDoc, newDoc) {
                        return oldDoc.merge(newDoc, { updatedAt: Date.now() });
                    }
                })
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
