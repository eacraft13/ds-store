'use strict';

var _       = require('lodash');
var ds      = require('ds-client');
var express = require('express');
var url     = require('url');

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
        var itemId;
        var link = url.parse(req.body.link);
        var resaleId = req.resaleId;

        itemId = _.find(link.pathname.split('/'), function (part) {
            return /^[0-9]{8}$/.test(part);
        });

        return ds
            .merchant
            .getItem('walmart', itemId)
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
