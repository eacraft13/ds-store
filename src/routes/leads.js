'use strict';

var Lead     = require('../models/Resale')('leads'),
    Snipe    = require('../models/Snipe')(Lead),
    Supply   = require('../models/Supply')(Lead);
var _        = require('lodash');
var ebay     = require('ebay-dev-api')(require('../../private/ebay'));
var express  = require('express'),
    router   = express.Router();
var resales  = require('./_resales');
var snipes   = require('./snipes');
var supplies = require('./supplies');
var url      = require('url');

router.use('/', resales(Lead));
router.use('/:id/snipes', snipes(Snipe));
router.use('/:id/supplies', supplies(Supply));

/**
 * @generate
 */
router.post('/generate', function (req, res) {
    var id;
    var link = url.parse(req.body.link);

    id = _.find(link.pathname.split('/'), function (part) {
        return /^[0-9]{8,19}$/.test(part);
    });

    return ebay
        .shopping
        .getMultipleItems([id])
        .then(function (items) {
            return _.map(items, function (item) {
                return { ebay: { shopping: item } };
            });
        })
        .then(function (items) {
            return _(items)
                .map(function (item) {
                    var variations = ebay.shopping.explodeVariations(item.ebay.shopping);

                    return _.map(variations, function (variation) {
                        var clone = _.cloneDeep(item);

                        clone.ebay.shopping = variation;
                        clone.id = ebay.shopping.generateId(variation);

                        return clone;
                    });
                })
                .flatten()
                .valueOf();
        })
        .then(function (leads) {
            return Promise.all(_.map(leads, function (lead) {
                return Lead
                    .createOrUpdate(lead)
                    .then(function (result) {
                        if (result.errors === 0)
                            return lead;

                        return Promise.reject(new Error(JSON.stringify(result)));
                    });
            }));
        })
        .then(function (leads) {
            return Promise.all(_.map(leads, function (lead) {
                return Snipe.createOrReplace(lead.id, lead);
            }));
        })
        .then(function (results) {
            return res.results(results);
        })
        .catch(function (err) {
            return res.error(err);
        });
});

/**
 * @list
 */
router.post('/:id/list', function (req, res) {
    var id = req.params.id;

    return res.send('WIP');
});

module.exports = router;
