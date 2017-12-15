'use strict';

var r = require('../r');
var schema;
var Joi = require('joi');
var Resale;

schema = Joi.object().keys({
    createdAt: Joi.date().default(r.now()),
    dateListed: Joi.array().item(Joi.object().keys({
        start: Joi.date(),
        end: Joi.date(),
    })),
    eBayId: Joi.string().required(),
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
    supplies: Joi.array().items(Joi.string()),
    tax: Joi.number().min(0),
    visits: Joi.number().min(0),
    watchers: Joi.number().min(0),
});

/**
 * Create (or update)
 */
Resale.createOrUpdate = function (resale) {

};

/**
 * Get one (by id)
 */
Resale.getOne = function (id) {

};

/**
 * Get all (by query)
 */
Resale.getAll = function (query) {

};

/**
 * Destroy (by id)
 */
Resale.destroy = function (id) {

};

module.exports = Resale;
