'use strict';

var express = require('express'),
    router = express.Router();
var Sale = require('../models/sale');

/**
 * @index
 */
router.get('/', function (req, res) {
    return Sale.getAll()
        .then(function (sale) {
            return res.json(sale);
        })
        .error(function (err) {
            return res.error(err);
        });
});

/**
 * @create
 */
router.post('/', function (req, res) {
    return Sale.createOrUpdate(req.body)
        .then(function (result) {
            return res.json(result);
        })
        .error(function (err) {
            return res.error(err);
        });
});

/**
 * @show
 */
router.get('/:id', function (req, res) {
    return Sale.getOne(req.params.id)
        .then(function (sales) {
            return res.json(sales);
        })
        .error(function (err) {
            return res.error(err);
        });
});

/**
 * @update
 */
router.patch('/:id', function (req, res) {
    return Sale.createOrUpdate(req.body)
        .then(function (result) {
            return res.json(result);
        })
        .error(function (err) {
            return res.error(err);
        });
});

/**
 * destroy
 */
router.delete('/:id', function (req, res) {
    return Sale.destroy(req.params.id)
        .then(function (result) {
            return res.json(result);
        })
        .error(function (err) {
            return res.error(err);
        });
});

module.exports = router;
