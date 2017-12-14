'use strict';

var thinky = require('../thinky'),
    type = thinky.type;
var Sale;

Sale = thinky.createModel('Sale', {
    resaleId: type.string(),
    // ...
});

module.exports = Sale;
