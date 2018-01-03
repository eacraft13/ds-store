'use strict';

var Joi     = require('joi');
var Promise = require('bluebird');
var _       = require('lodash');

/**
 * Abstract supply model
 * @param {string} tableName
 * @param {Joi} schema
 */
module.exports = function (Resale) {
    var Supply = {};
    var schema;

    /**
     * Schema
     */
    schema = Joi.object().keys({
        id: Joi.string().required(),

        merchantId: Joi.string().required(),
        merchantName: Joi.string().lowercase().required(),

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
            })).default([]),
            specifics: Joi.array().items(Joi.object().keys({
                name: Joi.string(),
                value: Joi.string()
            })).default([]),
            isAvailable: Joi.boolean()
        }),
        price: Joi.object().keys({
            price: Joi.number().min(0).precision(2),
            estimatedTax: Joi.number().min(0).precision(2).default(0),
            shippingCost: Joi.number().min(0).precision(2).default(0),
            hasSingleItemAvailable: Joi.boolean()
        }),
        shipping: Joi.object().keys({
            cost: Joi.number().min(0).precision(2),
            minDeliveryDate: Joi.date().timestamp().raw(),
            maxDeliveryDate: Joi.date().timestamp().raw()
        }),

        '@merchant': Joi.string().allow(null), // json

        createdAt: Joi.date().timestamp().raw().default(Date.now, 'time of creation'),
    });

    /**
     * Create
     */
    Supply.createOrReplace = function (resaleId, supply) {
        var joi;

        joi = Joi.validate(supply, schema);

        if (joi.error)
            return Promise.reject(new Error(joi.error));

        return Resale
            .get(resaleId)
            .then(function (resale) {
                _.remove(resale.supplies, function (s) {
                    return s.merchantId === joi.value.merchantId && s.merchant === joi.value.merchant;
                });

                resale.supplies.push(joi.value);

                return resale;
            })
            .then(function (resale) {
                return Resale.createOrUpdate(resale);
            });
    };

    /**
     * Read
     */
    Supply.getAll = function (resaleId) {
        return Resale
            .get(resaleId)
            .then(function (resale) {
                return resale.supplies;
            });
    };

    /**
     * Destroy
     */
    Supply.destroy = function (resaleId, id) {
        return Resale
            .get(resaleId)
            .then(function (resale) {
                _.remove(resale.supplies, function (s) {
                    return s.id === id;
                });

                return resale;
            })
            .then(function (resale) {
                return Resale.createOrUpdate(resale);
            });
    };

    return Supply;
};
