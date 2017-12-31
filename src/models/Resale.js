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

        createdAt: Joi.date().timestamp().default(Date.now, 'time of creation'),
        updatedAt: Joi.date().timestamp().default(Date.now, 'time of update'),
    });


    /**
     * Create
     */
    Resale.createOrUpdate = function (resale) {
        var joi;

        joi = Joi.validate(resale, schema);

        if (joi.error)
            return Promise.reject(new Error(joi.error));

        return r
            .table(tableName)
            .insert(joi.value, {
                conflict: function (docId, oldDoc, newDoc) {
                    return oldDoc.merge(newDoc, {
                        createdAt: oldDoc('createdAt'),
                        updatedAt: newDoc('updatedAt')
                    });
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
    Resale.replace = function (resale) {
        var joi;

        joi = Joi.validate(resale, schema);

        if (joi.error)
            return Promise.reject(new Error(joi.error));

        return r
            .table(tableName)
            .insert(joi.value, {
                conflict: function (docId, oldDoc, newDoc) {
                    return oldDoc.replace({
                        resaleId: newDoc('resaleId'),
                        ebay: newDoc('ebay'),
                        updatedAt: newDoc('updatedAt')
                    });
                }
            })
            .run();
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
