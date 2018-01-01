'use strict';

var _ = require('lodash');
var ebay = require('ebay-dev-api')(require('../../private/ebay'));
var express = require('express');
var url = require('url');

module.exports = function (Snipe) {
    var router = express.Router();

    /**
     * @refresh
     */
    router.put('/refresh', function (req, res) {
        var resaleId = req.resaleId;
        var snipeIds;

        return Snipe
            .getAll(resaleId)
            .then(function (snipes) {
                snipeIds = _.map(snipes, 'id');
            })
            .then(function () {
                return ebay
                    .shopping
                    .getMultipleItems(_.map(snipeIds, function (id) {
                        return id.split('-')[0];
                    }));
            })
            .then(function (items) {
                return _.map(items, function (item) {
                    return { ebay: { shopping: item } };
                });
            })
            .then(function (resales) {
                return _(resales)
                    .map(function (resale) {
                        var variations = ebay.shopping.explodeVariations(resale.ebay.shopping);

                        return _.map(variations, function (variation) {
                            var clone = _.cloneDeep(resale);

                            clone.ebay.shopping = variation;
                            clone.id = ebay.shopping.generateId(variation);

                            return clone;
                        });
                    })
                    .flatten()
                    .valueOf();
            })
            .then(function (resales) {
                return _.filter(resales, function (resale) {
                    return _.includes(snipeIds, resale.id);
                });
            })
            .then(function (resales) {
                return Promise.all(_.map(resales, function (resale) {
                    return Snipe.createOrReplace(resaleId, resale);
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
     * @add
     */
    router.post('/add', function (req, res) {
        var id;
        var link = url.parse(req.body.link);
        var resaleId = req.resaleId;

        id = _.find(link.pathname.split('/'), function (part) {
            return /^[0-9]{8,19}$/.test(part);
        });

        return ebay
            .shopping
            .getMultipleItems([id])
            .then(function (items) {
                return _.map(items, function (item) {
                    return {
                        ebay: {
                            shopping: item
                        }
                    };
                });
            })
            .then(function (resales) {
                return _(resales)
                    .map(function (resale) {
                        var variations = ebay.shopping.explodeVariations(resale.ebay.shopping);

                        return _.map(variations, function (variation) {
                            var clone = _.cloneDeep(resale);

                            clone.ebay.shopping = variation;
                            clone.id = ebay.shopping.generateId(variation);

                            return clone;
                        });
                    })
                    .flatten()
                    .valueOf();
            })
            .then(function (resales) {
                return Promise.all(_.map(resales, function (resale) {
                    return Snipe.createOrReplace(resaleId, resale);
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
     * @remove
     */
    router.delete('/remove', function (req, res) {
        var id;
        var link = url.parse(req.body.link);
        var resaleId = req.resaleId;

        id = _.find(link.pathname.split('/'), function (part) {
            return /^[0-9]{8,19}$/.test(part);
        });

        return ebay
            .shopping
            .getMultipleItems([id])
            .then(function (items) {
                return _(items)
                    .map(function (item) {
                        var variations = ebay.shopping.explodeVariations(item);

                        return _.map(variations, function (variation) {
                            return ebay.shopping.generateId(variation);
                        });
                    })
                    .flatten()
                    .valueOf();
            })
            .then(function (ids) {
                return Promise.all(_.map(ids, function (id) {
                    return Snipe.destroy(resaleId, id);
                }));
            })
            .then(function (results) {
                return res.results(results);
            })
            .catch(function (err) {
                return res.error(err);
            });
    });

    return router;
};
