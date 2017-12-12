'use strict';

var express = require('express'),
    router = express.Router;

/**
 * @index
 */
router.get('/', function (req, res) {
    return res.json();
});

/**
 * @create
 */
router.post('/', function (req, res) {
    return res.json();
});

/**
 * @show
 */
router.get('/:id', function (req, res) {
    return res.json();
});

/**
 * @update
 */
router.patch('/:id', function (req, res) {
    return res.json();
});

/**
 * destroy
 */
router.delete('/:id', function (req, res) {
    return res.json();
});

module.exports = router;
