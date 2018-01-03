'use strict';

var Joi     = require('joi');
var Promise = require('bluebird');
var r       = require('../r');

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
        id: Joi.string().required(), // primary key

        itemId: Joi.string().required(),

        image: Joi.object().keys({
            gallery: Joi.string().uri(),
            images: Joi.array().items(Joi.string().uri())
        }),
        specifics: Joi.object().keys({
            title: Joi.string(),
            categoryId: Joi.string(),
            description: Joi.string(),
            item: Joi.array().items(Joi.object().keys({
                name: Joi.string(),
                value: Joi.array().items(Joi.string())
            })),
            variation: Joi.array().items(Joi.object().keys({
                name: Joi.string(),
                value: Joi.array().items(Joi.string())
            })),
            status: Joi.string(),
            startTime: Joi.date().timestamp().raw(),
            endTime: Joi.date().timestamp().raw()
        }),
        price: Joi.object().keys({
            price: Joi.number().min(0).precision(2),
            tax: Joi.number().min(0).precision(2).allow(null),
            shippingCost: Joi.number().min(0).precision(2).default(0),
            quantity: Joi.number().min(0)
        }),
        shipping: Joi.object().keys({
            cost: Joi.number().min(0).precision(2),
            handling: Joi.number().min(0),
            minDays: Joi.number().min(0).allow(null),
            maxDays: Joi.number().min(0).allow(null),
            isGlobal: Joi.boolean()
        }),
        profit: Joi.object().keys({
            snipeId: Joi.string().allow(null),
            supplyId: Joi.string().allow(null)
        }),
        hotness: Joi.object().keys({
            visits: Joi.number().min(0),
            watchers: Joi.number().min(0).allow(null),
            sold: Joi.number().min(0)
        }),
        snipes: Joi.array().items(Joi.object()).default([]),
        supplies: Joi.array().items(Joi.object()).default([]),

        '@ebay': Joi.object().keys({
            '@finding': Joi.string().allow(null), // json
            '@shopping': Joi.string().allow(null) // json
        }).default({}),

        createdAt: Joi.date().timestamp().raw().default(Date.now, 'time of creation'),
        updatedAt: Joi.date().timestamp().raw().default(Date.now, 'time of update'),
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
