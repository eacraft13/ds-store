'use strict';

var express = require('express');

module.exports = function (Supply) {
    var router = express.Router();

    /**
     * @refresh
     */
    router.put('/refresh', function (req, res) {
        var id = req.params.id;

        return res.send('WIP');
    });

    /**
     * @add
     */
    router.post('/add', function (req, res) {
        var link = req.body.link;

        return res.send('WIP');
    });

    /**
     * @remove
     */
    router.delete('/remove', function (req, res) {
        var link = req.body.link;

        return res.send('WIP');
    });

    return router;
};
