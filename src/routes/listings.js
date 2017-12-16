'use strict';

var express = require('express'),
    router = express.Router();
var Listing = require('../models/listing');

/**
 * @index
 */
router.get('/', function (req, res) {
    return Listing.getAll()
        .then(function (listings) {
            return res.json(listings);
        })
        .catch(function (err) {
            return res.error(err);
        });
});

/**
 * @create
 */
router.post('/', function (req, res) {
    return Listing.createOrUpdate(req.body)
        .then(function (result) {
            return res.json(result);
        })
        .catch(function (err) {
            return res.error(err);
        });
});

/**
 * @show
 */
router.get('/:id', function (req, res) {
    return Listing.getOne(req.params.id)
        .then(function (listing) {
            return res.json(listing);
        })
        .catch(function (err) {
            return res.error(err);
        });
});

/**
 * @update
 */
router.patch('/:id', function (req, res) {
    return Listing.createOrUpdate(req.body)
        .then(function (result) {
            return res.json(result);
        })
        .catch(function (err) {
            return res.error(err);
        });
});

/**
 * destroy
 */
router.delete('/:id', function (req, res) {
    return Listing.destroy(req.params.id)
        .then(function (result) {
            return res.json(result);
        })
        .catch(function (err) {
            return res.error(err);
        });
});

module.exports = router;
