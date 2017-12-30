'use strict';

var Joi     = require('joi');
var Promise = require('bluebird');
var _       = require('lodash');
var uuidv4  = require('uuid/v4');

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
        id: Joi.string().guid().default(uuidv4()), // primary key

        snipeId: Joi.object().keys({
            itemId: Joi.string().required(),
            variationHash: Joi.string().default(0),
        }),

        ebay: Joi.object().keys({
            finding: Joi.object().allow(null),
            shopping: Joi.object().required(),
        }),

        createdAt: Joi.date().timestamp('unix').default(Date.now, 'time of creation'),
        updatedAt: Joi.date().timestamp('unix').default(Date.now, 'time of update'),
    });

    /**
     * Create
     */
    Snipe.createOrReplace = function (resaleId, snipe) {
        var joi;

        delete snipe.createdAt;
        delete snipe.updatedAt;

        joi = Joi.validate(snipe, schema);

        if (joi.error)
            return Promise.reject(new Error(joi.error));

        return Resale
            .get(resaleId)
            .then(function (resale) {
                _.remove(resale.snipes, function (s) {
                    return s.id === joi.value.id;
                });
                resale.snipes.push(snipe);

                return resale;
            })
            .then(function (resale) {
                return Resale
                    .update(resaleId, resale);
            });
    };

    /**
     * Read
     */
    Snipe.getAll = function (resaleId) {
        return Resale
            .get(resaleId)
            .then(function (resale) {
                return resale.snipes;
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
                return Resale
                    .update(resale);
            });
    };

    return Snipe;
};
