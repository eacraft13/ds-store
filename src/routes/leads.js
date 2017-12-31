'use strict';

var Lead     = require('../models/Resale')('leads'),
    Snipe    = require('../models/Snipe')(Lead),
    Supply   = require('../models/Supply')(Lead);
var express  = require('express'),
    router   = express.Router();
var resales  = require('./_resales');
var snipes   = require('./snipes');
var supplies = require('./supplies');

router.use('/', resales(Lead));
router.use('/:id/snipes', snipes(Snipe));
router.use('/:id/supplies', supplies(Supply));

/**
 * @generate
 */
router.post('/generate', function (req, res) {
    return res.send('WIP');
});

/**
 * @list
 */
router.post('/:id/list', function (req, res) {
    var id = req.params.id;

    return res.send('WIP');
});

module.exports = router;
