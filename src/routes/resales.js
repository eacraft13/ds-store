'use strict';

var express = require('express'),
    router = express.Router();
var Resale = require('../models/resale');

/**
 * @index
 */
router.get('/', function (req, res) {
    return Resale.getAll()
        .then(function (resales) {
            return res.json(resales);
        })
        .catch(function (err) {
            return res.error(err);
        });
});

/**
 * @create
 */
router.post('/', function (req, res) {
    return Resale.createOrUpdate(req.body)
        .then(function (result) {
            if (result.errors > 0)
                return res.error(400, result.first_error);

            if (result.inserted > 0)
                return res.status(201).json();

            if (result.replaced > 0 || result.skipped > 0 || result.unchanged > 0)
                return res.status(204).json();

            return res.error(501, 'Unknown error');
        })
        .catch(function (err) {
            return res.error(err);
        });
});

/**
 * @show
 */
router.get('/:id', function (req, res) {
    return Resale.getOne(req.params.id)
        .then(function (resale) {
            return res.json(resale);
        })
        .catch(function (err) {
            return res.error(err);
        });
});

/**
 * @update
 */
router.patch('/:id', function (req, res) {
    return Resale.createOrUpdate(req.body)
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
    return Resale.destroy(req.params.id)
        .then(function (result) {
            return res.json(result);
        })
        .catch(function (err) {
            return res.error(err);
        });
});

module.exports = router;
