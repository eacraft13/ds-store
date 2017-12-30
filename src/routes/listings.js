'use strict';

var Listing  = require('../models/Resale')('listing'),
    Snipe    = require('../models/Snipe')(Listing),
    Supply   = require('../models/Supply')(Listing);
var express  = require('express'),
    router   = express.Router();
var resales  = require('./_resales');
var snipes   = require('./snipes');
var supplies = require('./supplies');

router.use('/', resales(Listing));
router.use('/:id/snipes', snipes(Snipe));
router.use('/:id/supplies', supplies(Supply));

/**
 * @sync
 */
router.put('/sync', function (req, res) {
    return res.send('WIP');
});

/**
 * @edit
 */
router.put('/:id/edit', function (req, res) {
    var id = req.params.id;

    return res.send('WIP');
});

/**
 * @relist
 */
router.post('/:id/relist', function (req, res) {
    var id = req.params.id;

    return res.send('WIP');
});

module.exports = router;
