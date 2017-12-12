(function () {
    'use strict';

    var conf = require('../conf/db'),
        thinky = require('thinky')(conf),
        type = thinky.type;

    thinky.dbReady()
    .then(function () {
        /**
         * Resale
         */
        thinky.createModel('Resale', {
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

        /**
         * Supply
         */
        thinky.createModel('Supply', {
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

        /**
         * Lead
         */
        thinky.createModel('Lead', {
            resaleId: type.string(),
        });
    });
}());
