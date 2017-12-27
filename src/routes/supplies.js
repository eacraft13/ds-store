'use strict';

var express = require('express'),
    router = express.Router();
var Supply = require('../models/Supply');

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
router.get('/:supply_id', function (req, res) {
    return res.status(200).json();
});

/**
 * @destroy
 */
router.delete('/:supply_id', function (req, res) {
    return res.status(202).json();
});

/**
 * @refresh
 */
router.put('/:supply_id/refresh', function (req, res) {
    return res.status(202).json();
});

module.exports = router;
