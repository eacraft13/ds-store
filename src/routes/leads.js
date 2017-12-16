'use strict';

var express = require('express'),
    router = express.Router();
var Lead = require('../models/lead');

/**
 * @index
 */
router.get('/', function (req, res) {
    return Lead.getAll()
        .then(function (leads) {
            return res.json(leads);
        })
        .catch(function (err) {
            return res.error(err);
        });
});

/**
 * @create
 */
router.post('/', function (req, res) {
    return Lead.createOrUpdate(req.body)
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
    return Lead.getOne(req.params.id)
        .then(function (lead) {
            return res.json(lead);
        })
        .catch(function (err) {
            return res.error(err);
        });
});

/**
 * @update
 */
router.patch('/:id', function (req, res) {
    return Lead.createOrUpdate(req.body)
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
    return Lead.destroy(req.params.id)
        .then(function (result) {
            return res.json(result);
        })
        .catch(function (err) {
            return res.error(err);
        });
});

module.exports = router;
