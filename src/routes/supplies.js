'use strict';

var _       = require('lodash');
var ds      = require('ds-client');
var express = require('express');

module.exports = function (Supply) {
    var router = express.Router();

    /**
     * @refresh
     */
    router.put('/refresh', function (req, res) {
        var resaleId = req.resaleId;
        var merchants;

        return Supply
            .getAll(resaleId)
            .then(function (supplies) {
                merchants = _.map(supplies, function (supply) {
                    return {
                        name: supply.merchantName,
                        id: supply.merchantId
                    };
                });
            })
            .then(function () {
                var promises = _.map(merchants, function (merchant) {
                    return ds.merchant.getItem(merchant.name, merchant.id);
                });

                return Promise.all(promises);
            })
            .then(function (supplies) {
                var promises = _.map(supplies, function (supply) {
                    return Supply.createOrReplace(resaleId, supply);
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
        var link = req.body.link;
        var resaleId = req.resaleId;

        return ds
            .merchant
            .getItem(link)
            .then(function (item) {
                return Supply.createOrReplace(resaleId, item);
            })
            .then(function (result) {
                return res.result(result);
            })
            .catch(function (err) {
                return res.error(err);
            });
    });

    /**
     * @remove
     */
    router.delete('/remove', function (req, res) {
        var link = req.body.link;
        var resaleId = req.resaleId;

        return ds
            .merchant
            .getItem(link)
            .then(function (item) {
                return item.id;
            })
            .then(function (id) {
                return Supply.destroy(resaleId, id);
            })
            .then(function (result) {
                return res.result(result);
            })
            .catch(function (err) {
                return res.error(err);
            });
    });

    return router;
};
