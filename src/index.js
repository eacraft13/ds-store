'use strict';

var Lead     = require('./models/Lead');
var Listing  = require('./models/Listing');
var config   = require('./config/server');
var cors     = require('cors');
var express  = require('express'),
    app      = express();
var leads    = require('./routes/leads');
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
                return res.error(404, 'Listing not found');

            req.resale = listing;
            req.model = Listing;

            return next();
        });
}, snipes);
app.use('/listings/:listing_id/supplies', function (req, res, next) {
    return Listing
        .get(req.params.listing_id)
        .then(function (listing) {
            if (!listing)
                return res.error(404, 'Listing not found');

            req.resale = listing;
            req.model = Listing;

            return next();
        });
}, snipes);

/**
 * Leads
 */
app.use('/leads', leads);
app.use('/leads/:lead_id/snipes', function (req, res, next) {
    return Lead
        .get(req.params.lead_id)
        .then(function (lead) {
            if (!lead)
                return res.error(404, 'Lead not found');

            req.resale = lead;
            req.model = Lead;

            return next();
        });
}, snipes);
app.use('/leads/:lead_id/supplies', function (req, res, next) {
    return Lead
        .get(req.params.lead_id)
        .then(function (lead) {
            if (!lead)
                return res.error(404, 'Lead not found');

            req.resale = lead;
            req.model = Lead;

            return next();
        });
}, snipes);

app.listen(config.port);

process.on('exit', function () {
    r.getPoolMaster().drain();
});
