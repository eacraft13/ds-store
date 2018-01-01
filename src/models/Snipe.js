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

        ebay: Joi.object().keys({
            finding: Joi.object().allow(null),
            shopping: Joi.object().required(),
        }),

        createdAt: Joi.date().timestamp().default(Date.now, 'time of creation'),
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
