'use strict';

var thinky = require('../thinky'),
    type = thinky.type;
var Lead;

Lead = thinky.createModel('Lead', {
    resaleId: type.string(),
});

module.exports = Lead;
