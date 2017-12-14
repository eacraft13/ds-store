'use strict';

var express = require('express'),
    router = express.Router();
var Sale = require('../models/sale');

/**
 * @index
 */
router.get('/', function (req, res) {
    return Sale
        .run()
        .then(res.json)
        .error(res.error);
});

/**
 * @create
 */
router.post('/', function (req, res) {
    return new Sale(req.body)
        .save()
        .then(res.json)
        .error(res.error);
});

/**
 * @show
 */
router.get('/:id', function (req, res) {
    return Sale
        .get(req.params.id)
        .run()
        .then(res.json)
        .error(res.error);
});

/**
 * @update
 */
router.patch('/:id', function (req, res) {
    return Sale
        .get(req.params.id)
        .update(req.body)
        .run()
        .then(res.json)
        .error(res.error);
});

/**
 * destroy
 */
router.delete('/:id', function (req, res) {
    return Sale
        .get(req.params.id)
        .delete()
        .run()
        .then(res.json)
        .error(res.error);
});

module.exports = router;
