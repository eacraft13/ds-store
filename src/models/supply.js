'use strict';

var r = require('../r');
var schema;
var Joi = require('joi');
var Supply;

schema = Joi.object().keys({
    createdAt: Joi.date().timestamp('unix').default(r.now()),
    isAvailable: Joi.boolean(),
    rank: Joi.object(), // todo - make this better
    shipping: Joi.object().keys({
        cost: Joi.number().min(0),
        estimatedDelivery: Joi.object().keys({
            max: Joi.number().min(0),
            min: Joi.number().min(0)
        })
    }),
    supplier: Joi.object().keys({
        source: Joi.string(),
        id: Joi.string()
    }),
    tax: Joi.number().min()
});

/**
 * Create (or update)
 */
Supply.createOrUpdate = function (supply) {

};

/**
 * Get one (by id)
 */
Supply.getOne = function (id) {

};

/**
 * Get all (by query)
 */
Supply.getAll = function (query) {

};

/**
 * Destroy (by id)
 */
Supply.destroy = function (id) {

};

module.exports = Supply;
