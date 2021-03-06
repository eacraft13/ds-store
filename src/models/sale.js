'use strict';

var r = require('../r');
var schema;
var Joi = require('joi');
var Sale = {};
var Resale = require('./resale');

schema = Joi.object().keys({
    createdAt: Joi.date().timestamp('unix').default(Date.now(), 'created at date'),
    resaleId: Joi.string().required()
});

/**
 * Create (or update)
 */
Sale.createOrUpdate = function (resale) {

};

/**
 * Get one (by id)
 */
Sale.getOne = function (id) {

};

/**
 * Get all (by query)
 */
Sale.getAll = function (query) {

};

/**
 * Destroy (by id)
 */
Sale.destroy = function (id) {

};

module.exports = Sale;
