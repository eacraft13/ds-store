'use strict';

var Lead     = require('../models/Resale')('leads'),
    Snipe    = require('../models/Snipe')(Lead),
    Supply   = require('../models/Supply')(Lead);
var _        = require('lodash');
var ds       = require('ds-client');
var express  = require('express'),
    router   = express.Router();
var resales  = require('./_resales');
var snipes   = require('./snipes');
var supplies = require('./supplies');
var url      = require('url');

router.use('/', resales(Lead));
router.use('/:id/snipes', snipes(Snipe));
router.use('/:id/supplies', supplies(Supply));

/**
 * @generate
 */
router.post('/generate', function (req, res) {
    var itemId;
    var link = url.parse(req.body.link);

    itemId = _.find(link.pathname.split('/'), function (part) {
        return /^[0-9]{8,19}$/.test(part);
    });

    return ds
        .ebay
        .getItem(itemId)
        .then(function (leads) {
            var promises = _.map(leads, function (lead) {
                return Lead
                    .createOrUpdate(lead)
                    .then(function (result) {
                        if (result.errors === 0)
                            return lead;

                        return Promise.reject(new Error(JSON.stringify(result)));
                    });
            });

            return Promise.all(promises);
        })
        .then(function (leads) {
            return _.map(leads, function (lead) {
                return _.omit(lead, ['profit']);
            });
        })
        .then(function (leads) {
            var promises = _.map(leads, function (lead) {
                return Snipe.createOrReplace(lead.id, lead);
            });

            return Promise.all(promises);
        })
        .then(function (results) {
            return res.results(results);
        })
        .catch(function (err) {
            return res.error(err);
        });
});

/**
 * @list
 */
router.post('/:id/list', function (req, res) {
    var id = req.params.id;

    return res.send('WIP');
});

module.exports = router;
