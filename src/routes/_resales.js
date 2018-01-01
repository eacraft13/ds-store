'use strict';

var ebay = require('ebay-dev-api')(require('../../private/ebay'));
var express = require('express');

module.exports = function (Resale) {
    var router  = express.Router();

    /**
     * @index
     */
    router.get('/', function (req, res) {
        return Resale
            .getAll()
            .then(function (resales) {
                return res.json(resales);
            })
            .catch(function (err) {
                return res.error(err);
            });
    });

    /**
     * @create
     */
    router.post('/', function (req, res) {
        var resale = req.body;

        resale.id = ebay.shopping.generateId(resale.ebay.shopping);

        return Resale
            .createOrUpdate(resale)
            .then(function (result) {
                return res.result(result);
            })
            .catch(function (err) {
                return res.error(err);
            });
    });

    /**
     * @show
     */
    router.get('/:id', function (req, res) {
        var id = req.params.id;

        return Resale
            .get(id)
            .then(function (resale) {
                return res.json(resale);
            })
            .catch(function (err) {
                return res.error(err);
            });
    });

    /**
     * @destroy
     */
    router.delete('/:id', function (req, res) {
        var id = req.params.id;

        return Resale
            .destroy(id)
            .then(function (result) {
                return res.result(result);
            })
            .catch(function (err) {
                return res.error(err);
            });
    });

    return router;
};
