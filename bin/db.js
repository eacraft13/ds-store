'use strict';

var _ = require('lodash');
var config = require('../src/config/db'),
    r = require('rethinkdbdash')(config);
var schemas;

schemas = [
    {
        name: 'lead',
        primaryKey: 'resaleId'
    },
    {
        name: 'listing',
        primaryKey: 'resaleId'
    },
    {
        name: 'resale',
        primaryKey: 'id'
    },
    {
        name: 'sale',
    },
    {
        name: 'supply'
    }
];

r
.dbList()
.run()
.then(function (dbs) {
    if (_.includes(dbs, config.db))
        return true;
    else
        return r.dbCreate(config.db);
})
.then(function () {
    return r.db(config.db).tableList();
})
.then(function (tables) {
    return _.filter(schemas, function (options) {
        return !_.includes(tables, options.name);
    });
})
.then(function (tables) {
    return Promise.all(
        _.map(tables, function (options) {
            return r.db(config.db)
                .tableCreate(options.name, { primaryKey: options.primaryKey })
                .run();
        })
    );
})
.then(function (result) {
    console.log(result);
    process.exit();
})
.error(function (err) {
    console.log(err);
    process.exit(1);
});


