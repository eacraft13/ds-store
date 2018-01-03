'use strict';

var _       = require('lodash');
var ds      = require('ds-client');
var express = require('express');
var url     = require('url');

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
                var itemIds = _.map(snipeIds, function (snipeId) {
                    return snipeId.split('-')[0];
                });

                return ds.ebay.getItems(itemIds);
            })
            .then(function (snipes) {
                return _.filter(snipes, function (snipe) {
                    return _.includes(snipeIds, snipe.id);
                });
            })
            .then(function (snipes) {
                var promises = _.map(snipes, function (snipe) {
                    return Snipe.createOrReplace(resaleId, snipe);
                });

                return Promise.all(promises);
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
        var itemId;
        var link = url.parse(req.body.link);
        var resaleId = req.resaleId;

        itemId = _.find(link.pathname.split('/'), function (part) {
            return /^[0-9]{8,19}$/.test(part);
        });

        return ds
            .ebay
            .getItem(itemId)
            .then(function (snipes) {
                var promises = _.map(snipes, function (snipe) {
                    return Snipe.createOrReplace(resaleId, snipe);
                });

                return Promise.all(promises);
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
        var itemId;
        var link = url.parse(req.body.link);
        var resaleId = req.resaleId;

        itemId = _.find(link.pathname.split('/'), function (part) {
            return /^[0-9]{8,19}$/.test(part);
        });

        return ds
            .ebay
            .getItem(itemId)
            .then(function (items) {
                return _.map(items, 'id');
            })
            .then(function (snipeIds) {
                var promises = _.map(snipeIds, function (snipeId) {
                    return Snipe.destroy(resaleId, snipeId);
                });

                return Promise.all(promises);
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
