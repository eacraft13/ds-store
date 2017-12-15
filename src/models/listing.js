'use strict';

var r = require('../r');
var schema;
var Joi = require('joi');
var Listing;
var Resale = require('./resale');

schema = Joi.object().keys({
    createdAt: Joi.date().timestamp('unix').default(r.now()),
    resaleId: Joi.string().required()
});

/**
 * Create (or update)
 */
Listing.createOrUpdate = function (listing) {

};

/**
 * Get one (by id)
 */
Listing.getOne = function (id) {

};

/**
 * Get all (by query)
 */
Listing.getAll = function (query) {

};

/**
 * Destroy (by id)
 */
Listing.destroy = function (id) {

};

module.exports = Listing;

