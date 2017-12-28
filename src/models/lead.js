/**
 * Leads are potential listings on eBay store
 */

'use strict';

var Joi     = require('joi');
var Lead = {};
var Promise = require('bluebird');
var _       = require('lodash');
var ebay    = require('ebay-dev-api')(require('../../private/ebay'));
var r       = require('../r');
var schema;
var table   = 'leads';

/**
 * Lead schema
 */
schema = Joi.object().keys({
    id: Joi.string().required(),

    ebay: Joi.object().keys({
        finding: Joi.object().allow(null),
        shopping: Joi.object().required(),
    }),

    snipes: Joi.array().items(Joi.string()).default([]), // [snipe_id]
    supplies: Joi.array().items(Joi.string()).default([]), // [supply_id]

    createdAt: Joi.date().timestamp('unix').default(Date.now, 'time of creation'),
    updatedAt: Joi.date().timestamp('unix').default(Date.now, 'time of update'),
});

/**
 * Get all
 */
Lead.getAll = function (filters) {
    var query = r.table(table);

    if (filters)
        query.filter(filters);

    return query
        .run();
};

/**
 * Get (by id)
 */
Lead.get = function (id) {
    return r
        .table(table)
        .get(id)
        .run();
};

/**
 * Destroy (by id)
 */
Lead.destroy = function (id) {
    return r
        .table(table)
        .get(id)
        .delete()
        .run();
};

/**
 * Create (or update)
 */
Lead.createOrUpdate = function (lead) {
    var joi;

    delete lead.createdAt;
    delete lead.updatedAt;

    lead.id = ebay.shopping.generateId(lead.ebay.shopping);
    joi = Joi.validate(lead, schema);

    if (joi.error)
        return Promise.reject(new Error(joi.error));

    return r
        .table(table)
        .insert(joi.value, {
            conflict: function (id, oldDoc, newDoc) {
                return oldDoc.merge(newDoc, { updatedAt: Date.now() });
            }
        })
        .run();
};

/**
 * Sync all
 */
Lead.sync = function (ids) {
    var self = this;

    ids = _.map(ids, function (id) {
        return ebay.shopping.explodeId(id);
    });

    return ebay
        .shopping
        .getMultipleItems(_.map(ids, 'itemId'))
        .then(function (items) {
            return _.map(items, function (item) {
                return {
                    ebay: {
                        shopping: item
                    }
                };
            });
        })
        .then(function (leads) {
            return _(leads)
                .map(function (lead) {
                    var explodedId, variation;

                    explodedId = _.find(ids, function (id) {
                        return lead.ebay.shopping.ItemID === id.itemId;
                    });
                    variation = ebay.shopping.getVariation(lead.ebay.shopping, explodedId.variationHash);

                    lead.ebay.shopping = variation;

                    return lead;
                })
                .valueOf();
        })
        .then(function (leads) {
            return Promise
                .all(
                    _.map(leads, function (lead) {
                        return self.createOrUpdate(lead);
                    })
                );
        });

};

/**
 * Refresh (by id)
 */
Lead.refresh = function (id) {
    var explodedId = ebay.shopping.explodeId(id);
    var self = this;

    return ebay
        .shopping
        .getMultipleItems([explodedId.itemId])
        .then(function (items) {
            return {
                ebay: {
                    shopping: items[0]
                }
            };
        })
        .then(function (lead) {
            var variation = ebay.shopping.getVariation(lead.ebay.shopping, explodedId.variationHash);

            lead.ebay.shopping = variation;

            return lead;
        })
        .then(function (lead) {
            return self.createOrUpdate(lead);
        });
};

/**
 * List lead
 */
Lead.list = function (id, options) {

};

module.exports = Lead;

