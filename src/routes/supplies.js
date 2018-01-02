'use strict';

var _       = require('lodash');
var express = require('express');
var url     = require('url');
var walmart = require('walmart')(require('../../private/walmart').key);

module.exports = function (Supply) {
    var router = express.Router();

    /**
     * @refresh
     */
    router.put('/refresh', function (req, res) {
        var id = req.params.id;

        return res.send('WIP');
    });

    /**
     * @add
     */
    router.post('/add', function (req, res) {
        var id;
        var link = url.parse(req.body.link);
        var resaleId = req.resaleId;

        id = _.find(link.pathname.split('/'), function (part) {
            return /^[0-9]{8}$/.test(part);
        });

        return walmart
            .getItem(id)
            .then(function (item) {
                return {
                    merchant: 'Walmart',
                    merchantId: item.product.usItemId,
                    data: item.product
                };
            })
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

        return res.send('WIP');
    });

    return router;
};
