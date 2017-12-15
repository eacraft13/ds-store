'use strict';

var r = require('../r');
var schema;
var Joi = require('joi');
var Lead;
var Resale = require('./resale');

schema = Joi.object().keys({
    createdAt: Joi.date().timestamp('unix').default(r.now()),
    resaleId: Joi.string().required()
});

/**
 * Create (or update)
 */
Lead.createOrUpdate = function (lead) {

};

/**
 * Get one (by id)
 */
Lead.getOne = function (id) {

};

/**
 * Get all (by query)
 */
Lead.getAll = function (query) {

};

/**
 * Destroy (by id)
 */
Lead.destroy = function (id) {

};

module.exports = Lead;
