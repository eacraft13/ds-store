'use strict';

var thinky = require('../thinky'),
    type = thinky.type;
var Supply;

Supply = thinky.createModel('Supply', {
    isAvailable: type.boolean(),
    rank: type.object(),
    shipping: {
        cost: type.number(),
        estimatedDelivery: {
            min: type.number(),
            max: type.number(),
        }
    },
    supplier: {
        name: type.string(),
        meta: type.any(),
    },
    tax: type.number(),
});

module.exports = Supply;
