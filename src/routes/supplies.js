'use strict';

var express = require('express'),
    router = express.Router();
var Supply = require('../models/supply');

/**
 * @index
 */
router.get('/', function (req, res) {
    return Supply.getAll()
        .then(function (supplies) {
            return res.json(supplies);
        })
        .error(function (err) {
            return res.error(err);
        });
});

/**
 * @create
 */
router.post('/', function (req, res) {
    return Supply.createOrUpdate(req.body)
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
    return Supply.getOne(req.params.id)
        .then(function (supply) {
            return res.json(supply);
        })
        .error(function (err) {
            return res.error(err);
        });
});

/**
 * @update
 */
router.patch('/:id', function (req, res) {
    return Supply.createOrUpdate(req.body)
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
    return Supply.destroy(req.params.id)
        .then(function (result) {
            return res.json(result);
        })
        .error(function (err) {
            return res.error(err);
        });
});

module.exports = router;
