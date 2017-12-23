'use strict';

var r = require('../r');
var schema;
var table = 'resale';
var Joi = require('joi');
var Resale = {};

schema = Joi.object().keys({
    createdAt: Joi.date().timestamp('unix').default(Date.now(), 'created at date'),
    dateListed: Joi.array().items(Joi.object().keys({
        start: Joi.date(),
        end: Joi.date(),
    })),
    eBayId: Joi.string().required(), // primary key
    images: Joi.array().items(Joi.string()),
    link: Joi.string(),
    price: Joi.number().min(0),
    quantity: Joi.number().min(0).default(0),
    title: Joi.string(),
    rank: Joi.object().keys({
        product: Joi.number().allow(null),
        title: Joi.number().allow(null),
        isTopRated: Joi.boolean().allow(null)
    }),
    shipping: Joi.object().keys({
        cost: Joi.number().min(0).default(0),
        estimatedDelivery: Joi.object().keys({
            max: Joi.number().min(0).default(0),
            min: Joi.number().min(0).default(0),
        }),
        handlingTime: Joi.number().min(0),
        isGlobal: Joi.boolean(),
        service: Joi.string().allow(null),
    }),
    snipes: Joi.array().items(Joi.object().keys({
        active: Joi.boolean(),
        snipeId: Joi.string()
    })),
    sold: Joi.number().min(0).allow(null),
    state: Joi.string(),
    supplies: Joi.array().items(Joi.string()), // list of foreign keys
    tax: Joi.number().min(0).default(0),
    visits: Joi.number().min(0).allow(null),
    watchers: Joi.number().min(0).allow(null),
});

/**
 * Create (or update)
 */
Resale.createOrUpdate = function (resale) {
    return new Promise(function (resolve, reject) {
        Joi.validate(resale, schema, function (err, value) {
            if (err)
                return reject(new Error(err));
            resale = value;
        });

        r
        .table(table)
        .insert(resale, { conflict: 'update' })
        .run()
        .then(function (result) {
            return resolve(result);
        })
        .error(function (err) {
            return reject(new Error(err));
        });
    });
};

/**
 * Get one (by id)
 */
Resale.getOne = function (id) {
    return new Promise(function (resolve, reject) {
        r
        .table(table)
        .get(id)
        .run()
        .then(function (resale) {
            return resolve(resale);
        })
        .error(function (err) {
            return reject(new Error(err));
        });
    });
};

/**
 * Get all (by query)
 */
Resale.getAll = function (query) {
    return new Promise(function (resolve, reject) {
        r
        .table(table)
        .filter(query || null)
        .run()
        .then(function (cursor) {
            return cursor.toArray();
        })
        .then(function (resales) {
            return resolve(resales);
        })
        .error(function (err) {
            return reject(new Error(err));
        });
    });
};

/**
 * Destroy (by id)
 */
Resale.destroy = function (id) {
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

module.exports = Resale;
