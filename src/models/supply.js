'use strict';

var Joi     = require('joi');
var Promise = require('bluebird');
var _       = require('lodash');
var uuidv4  = require('uuid/v4');

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
        id: Joi.string().guid().default(uuidv4()), // primary key

        supplyId: Joi.object().keys({
            merchantName: Joi.string().required(),
            merchantId: Joi.string().required()
        }),

        merchant: Joi.object(),

        createdAt: Joi.date().timestamp().default(Date.now, 'time of creation'),
        updatedAt: Joi.date().timestamp().default(Date.now, 'time of update'),
    });

    /**
     * Create
     */
    Supply.createOrReplace = function (resaleId, supply) {
        var joi;

        delete supply.createdAt;
        delete supply.updatedAt;

        joi = Joi.validate(supply, schema);

        if (joi.error)
            return Promise.reject(new Error(joi.error));

        return Resale
            .get(resaleId)
            .then(function (resale) {
                _.remove(resale.supplies, function (s) {
                    return s.id === joi.value.id;
                });
                resale.supplies.push(supply);

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
                return Resale
                    .update(resale);
            });
    };

    return Supply;
};
