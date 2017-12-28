'use strict';

var Listing  = require('./models/Listing');
var config   = require('./config/app');
var cors     = require('cors');
var express  = require('express'),
    app      = express();
var listings = require('./routes/listings');
var morgan   = require('morgan');
var r        = require('./r');
var snipes   = require('./routes/snipes');

app.use(cors());
app.use(express.json());
app.use(morgan('(:date[clf]) [:method]:url :status (:res[content-length] kbs - :response-time ms)'));
app.use(require('res-error'));

/**
 * Listings
 */
app.use('/listings', listings);
app.use('/listings/:listing_id/snipes', function (req, res, next) {
    return Listing
        .get(req.params.listing_id)
        .then(function (listing) {
            if (!listing)
                return res.error(400, 'Listing not found');

            req.resale = listing;
            req.model = Listing;

            return next();
        });
}, snipes);

/**
 * Leads
 */

app.listen(config.port);

process.on('exit', function () {
    r.getPoolMaster().drain();
});
