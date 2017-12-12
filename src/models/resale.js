'use strict';

var thinky = require('../thinky'),
    type = thinky.type;
var Resale;

Resale = thinky.createModel('Resale', {
    dateListed: [{
        start: type.date(),
        end: type.date(),
    }],
    eBayId: type.string(),
    images: [ type.string() ],
    link: type.string(),
    price: type.number(),
    quantity: type.number(),
    title: type.string(),
    rank: {
        product: type.number(),
        title: type.number(),
    },
    shipping: {
        cost: type.number(),
        estimatedDelivery: {
            max: type.number(),
            min: type.number(),
        },
        handlingTime: type.number(),
        isGlobal: type.boolean(),
        service: type.string(),
    },
    snipes: [{
        active: type.boolean(),
        snipeId: type.string()
    }],
    sold: type.number(),
    supplies: [type.string()],
    tax: type.number(),
    visits: type.number(),
    watchers: type.number(),
});

module.exports = Resale;
