'use strict';

var thinky = require('../thinky'),
    type = thinky.type;
var Listing;

Listing = thinky.createModel('Listing', {
    resaleId: type.string(),
});

module.exports = Listing;
