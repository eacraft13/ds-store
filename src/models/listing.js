'use strict';

var r = require('../r');
var schema;
var table = 'listing';
var Joi = require('joi');
var Listing = {};
var Resale = require('./resale');

schema = Joi.object().keys({
    createdAt: Joi.date().timestamp('unix').default(r.now(), 'created at date'),
    resaleId: Joi.string().required()
});

/**
 * Create (or update)
 */
Listing.createOrUpdate = function (listing) {
    var validation = Joi.validate({ resaleId: listing.eBayId }, schema);

    if (validation.error)
        return Promise.reject(new Error(validation.error));

    Resale
    .createOrUpdate(validation.value)
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
Listing.getAll = function (query) {
    return new Promise(function (resolve, reject) {
        r
        .table(table)
        .filter(query)
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

