'use strict';

var express = require('express'),
    router = express.Router();
var Listing = require('../models/Listing');
var Snipe = require('../models/Snipe');
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
router.get('/:lead_id', function (req, res) {
    return res.status(200).json();
});

/**
 * @destroy
 */
router.delete('/:lead_id', function (req, res) {
    return res.status(202).json();
});

/**
 * @refresh
 */
router.put('/:lead_id/refresh', function (req, res) {
    return res.status(202).json();
});

/**
 * @edit
 */
router.patch('/:lead_id/edit', function (req, res) {
    return res.status(202).json();
});

/**
 * @list
 */
router.patch('/:lead_id/list', function (req, res) {
    return res.status(202).json();
});

/**
 * @reprice
 */
router.patch('/:lead_id/reprice', function (req, res) {
    return res.status(202).json();
});

/**
 * supplies@createOrUpdate
 */
router.post('/:lead_id/supplies', function (req, res) {
    return res.status(201).json();
});

/**
 * supplies@destroy
 */
router.post('/:lead_id/supplies/:supply_id', function (req, res) {
    return res.status(202).json();
});

/**
 * supplies@refresh
 */
router.put('/:lead_id/supplies/:supply_id', function (req, res) {
    return res.status(201).json();
});

/**
 * snipes@createOrUpdate
 */
router.post('/:lead_id/snipes', function (req, res) {
    return res.status(201).json();
});

/**
 * snipes@destroy
 */
router.post('/:lead_id/snipes/:supply_id', function (req, res) {
    return res.status(202).json();
});

/**
 * snipes@refresh
 */
router.put('/:lead_id/snipes/:supply_id', function (req, res) {
    return res.status(201).json();
});

module.exports = router;
