'use strict';

var r = require('../r');
var schema;
var table = 'resale';
var Joi = require('joi');
var Resale = {};

schema = Joi.object().keys({
    createdAt: Joi.date().default(r.now(), 'created at date'),
    dateListed: Joi.array().items(Joi.object().keys({
        start: Joi.date(),
        end: Joi.date(),
    })),
    eBayId: Joi.string().required(), // primary key
    images: Joi.array().items(Joi.string()),
    link: Joi.string(),
    price: Joi.number().min(0),
    quantity: Joi.number().min(0),
    title: Joi.string(),
    rank: Joi.object().keys({
        product: Joi.number(),
        title: Joi.number(),
    }),
    shipping: Joi.object().keys({
        cost: Joi.number().min(0),
        estimatedDelivery: Joi.object().keys({
            max: Joi.number().min(0),
            min: Joi.number().min(0),
        }),
        handlingTime: Joi.number().min(0),
        isGlobal: Joi.boolean(),
        service: Joi.string(),
    }),
    snipes: Joi.array().items(Joi.object().keys({
        active: Joi.boolean(),
        snipeId: Joi.string()
    })),
    sold: Joi.number().min(0),
    supplies: Joi.array().items(Joi.string()), // list of foreign keys
    tax: Joi.number().min(0),
    visits: Joi.number().min(0),
    watchers: Joi.number().min(0),
});

/**
 * Create (or update)
 */
Resale.createOrUpdate = function (resale) {
    var validation = Joi.validate(resale, schema);

    if (validation.error)
        return Promise.reject(new Error(validation.error));

    return new Promise(function (resolve, reject) {
        r
        .table(table)
        .insert(validation.value, { conflict: 'update' })
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
        .filter(query)
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
