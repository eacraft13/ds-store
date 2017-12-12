'use strict';

var express = require('express'),
    router = express.Router();
var Lead = require('../models/lead');

/**
 * @index
 */
router.get('/', function (req, res) {
    return Lead
        .run()
        .then(res.json)
        .error(res.error);
});

/**
 * @create
 */
router.post('/', function (req, res) {
    return new Lead(req.body)
        .save()
        .then(res.json)
        .error(res.error);
});

/**
 * @show
 */
router.get('/:id', function (req, res) {
    return Lead
        .get(req.params.id)
        .run()
        .then(res.json)
        .error(res.error);
});

/**
 * @update
 */
router.patch('/:id', function (req, res) {
    return Lead
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
    return Lead
        .get(req.params.id)
        .delete()
        .run()
        .then(res.json)
        .error(res.error);
});

module.exports = router;
