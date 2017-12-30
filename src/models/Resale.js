'use strict';

var Joi     = require('joi');
var Promise = require('bluebird');
var r       = require('../r');
var uuidv4  = require('uuid/v4');

/**
 * Abstract resale model
 * @param {string} tableName
 */
module.exports = function (tableName) {
    var Resale = {};
    var schema;

    /**
     * Schema
     */
    schema = Joi.object().keys({
        id: Joi.string().guid().default(uuidv4()), // primary key

        resaleId: Joi.object().keys({
            itemId: Joi.string().required(),
            variationHash: Joi.string().default(0),
        }),

        ebay: Joi.object().keys({
            finding: Joi.object().allow(null),
            shopping: Joi.object().required(),
        }).allow(null),

        snipes: Joi.array().items(Joi.object()).default([]),
        supplies: Joi.array().items(Joi.object()).default([]),

        createdAt: Joi.date().timestamp('unix').default(Date.now, 'time of creation'),
        updatedAt: Joi.date().timestamp('unix').default(Date.now, 'time of update'),
    });


    /**
     * Create
     */
    Resale.create = function (resale) {
        var joi;

        delete resale.createdAt;
        delete resale.updatedAt;

        joi = Joi.validate(resale, schema);

        if (joi.error)
            return Promise.reject(new Error(joi.error));

        return r
            .table(tableName)
            .insert(joi.value, {
                conflict: function (id, oldDoc, newDoc) {
                    return oldDoc.merge(newDoc, { updatedAt: Date.now() });
                }
            })
            .run();
    };

    /**
     * Read
     */
    Resale.getAll = function () {
        return r
            .table(tableName)
            .run();
    };

    Resale.get = function (id) {
        return r
            .table(tableName)
            .get(id)
            .run();
    };

    /**
     * Update
     */
    Resale.update = function (id, resale) {
        var joi;

        resale.updatedAt = Date.now();
        joi = Joi.validate(resale, schema);

        if (joi.error)
            return Promise.reject(new Error(joi.error));

        return r
            .table(tableName)
            .get(id)
            .update(joi.value)
            .run();
    };

    Resale.replace = function (id, resale) {
        var joi;

        delete resale.createdAt;
        delete resale.updatedAt;

        joi = Joi.validate(resale, schema);

        if (joi.error)
            return Promise.reject(new Error(joi.error));

        return r
            .table(tableName)
            .get(id)
            .run()
            .then(function (data) {
                data.resaleId = joi.value.resaleId;
                data.ebay = joi.value.ebay;

                return r
                    .table(tableName)
                    .get(id)
                    .replace(data)
                    .run();
            });
    };

    /**
     * Destroy
     */
    Resale.destroy = function (id) {
        return r
            .table(tableName)
            .get(id)
            .delete()
            .run();
    };

    return Resale;
};
