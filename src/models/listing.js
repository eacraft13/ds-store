'use strict';

var r = require('../r');
var schema;
var table = 'listing';
var Joi = require('joi');
var Listing = {};
var Resale = require('./resale');

schema = Joi.object().keys({
    createdAt: Joi.date().timestamp('unix').default(Date.now(), 'created at date'),
    resaleId: Joi.string().required(),
    updatedAt: Joi.date().timestamp('unix').default(Date.now(), 'updated at date'),
});

/**
 * Create (or update)
 */
Listing.createOrUpdate = function (resale) {
    return Resale
        .createOrUpdate(resale)
        .then(function (result) {
            if (result.errors > 0)
                return Promise.resolve(result);

            return new Promise(function (resolve, reject) {
                var joi = Joi.validate({ resaleId: resale.eBayId }, schema);

                if (joi.error)
                    return reject(new Error(joi.error));

                r
                .table(table)
                .insert(joi.value, {
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
Listing.getOne = function (id) {
    return new Promise(function (resolve, reject) {
        r
        .table(table)
        .get(id)
        .run()
        .then(function (listing) {
            return resolve(listing);
        })
        .error(function (err) {
            return reject(new Error(err));
        });
    });
};

/**
 * Get all (by query)
 */
Listing.getAll = function (filters) {
    return new Promise(function (resolve, reject) {
        var query = r.table(table);

        if (filters)
            query.filter(filters);

        query
        .run()
        .then(function (cursor) {
            return cursor.toArray();
        })
        .then(function (listings) {
            return resolve(listings);
        })
        .error(function (err) {
            return reject(new Error(err));
        });
    });
};

/**
 * Destroy (by id)
 */
Listing.destroy = function (id) {
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

module.exports = Listing;

