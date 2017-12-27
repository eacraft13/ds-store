'use strict';

var express = require('express'),
    router = express.Router();
var Snipe = require('../models/Snipe');

/**
 * @index
 */
router.get('/', function (req, res) {
    return res.status(200).json();
});

/**
 * @createOrUpdate
 */
router.post('/', function (req, res) {
    return res.status(201).json();
});

/**
 * @sync
 */
router.put('/sync', function (req, res) {
    return res.status(201).json();
});

/**
 * @show
 */
router.get('/:snipe_id', function (req, res) {
    return res.status(200).json();
});

/**
 * @destroy
 */
router.delete('/:snipe_id', function (req, res) {
    return res.status(202).json();
});

/**
 * @refresh
 */
router.put('/:snipe_id/refresh', function (req, res) {
    return res.status(202).json();
});

module.exports = router;
