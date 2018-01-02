'use strict';

var Joi     = require('joi');
var Promise = require('bluebird');
var _       = require('lodash');

/**
 * Abstract snipe model
 * @param {string} tableName
 * @param {Joi} schema
 */
module.exports = function (Resale) {
    var Snipe = {};
    var schema;

    /**
     * Schema
     */
    schema = Joi.object().keys({
        id: Joi.string().required(), // primary key

        image: Joi.object().keys({
            gallery: Joi.string().uri(),
            images: Joi.array().items(Joi.string().uri())
        }),
        specifics: Joi.object().keys({
            title: Joi.string(),
            description: Joi.string(),
            variation: Joi.array().items(Joi.object().keys({
                name: Joi.string(),
                value: Joi.string()
            })),
            specifics: Joi.array().items(Joi.object().keys({
                name: Joi.string(),
                value: Joi.string()
            })),
            listedDate: Joi.date().timestamp().raw()
        }),
        price: Joi.object().keys({
            price: Joi.number().min(0).precision(2),
            tax: Joi.number().min(0).precision(2).default(0),
            shippingCost: Joi.number().min(0).precision(2).default(0),
            quantity: Joi.number().min(0)
        }),
        shipping: Joi.object().keys({
            cost: Joi.number().min(0).precision(2),
            handling: Joi.number().min(0),
            minTime: Joi.number().min(0),
            maxTime: Joi.number().min(0)
        }),
        hotness: Joi.object().keys({
            visits: Joi.number().min(0),
            watchers: Joi.number().min(0),
            sold: Joi.number().min(0)
        }),

        '@ebay': Joi.object().keys({
            '@finding': Joi.object().allow(null),
            '@shopping': Joi.object().allow(null),
        }).default({}),

        createdAt: Joi.date().timestamp().raw().default(Date.now, 'time of creation'),
    });

    /**
     * Create
     */
    Snipe.createOrReplace = function (resaleId, snipe) {
        var joi;

        joi = Joi.validate(snipe, schema);

        if (joi.error)
            return Promise.reject(new Error(joi.error));

        return Resale
            .get(resaleId)
            .then(function (resale) {
                _.remove(resale.snipes, function (s) {
                    return s.id === joi.value.id;
                });

                resale.snipes.push(joi.value);

                return resale;
            })
            .then(function (resale) {
                return Resale.createOrUpdate(resale);
            });
    };

    /**
     * Read
     */
    Snipe.getAll = function (resaleId) {
        return Resale
            .get(resaleId)
            .then(function (resale) {
                return resale ? resale.snipes : [];
            });
    };

    /**
     * Destroy
     */
    Snipe.destroy = function (resaleId, id) {
        return Resale
            .get(resaleId)
            .then(function (resale) {
                _.remove(resale.snipes, function (s) {
                    return s.id === id;
                });

                return resale;
            })
            .then(function (resale) {
                return Resale.createOrUpdate(resale);
            });
    };

    return Snipe;
};
