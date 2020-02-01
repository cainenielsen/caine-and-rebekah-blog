const cors = require('cors')({origin: true});

const baseId = 'appSmEDkgeVZeg7s9';

var Airtable = require('airtable');
    Airtable.configure({
        endpointUrl: 'https://api.airtable.com',
        apiKey: 'keycbNISjFdGTMyUh'
});

const base = Airtable.base(baseId);


const functions = require('firebase-functions');

exports.loadTable = functions.https.onRequest((request, response) => {
    var search = request.query.slug;
    console.log(search);
    var find = 'SEARCH("' + search + '",{Slug})';
    base('Posts').select({
    // Selecting the first 3 records in Grid view:
    maxRecords: 1,
    view: "Grid view",
    filterByFormula: find
// eslint-disable-next-line prefer-arrow-callback
}).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    var result = [];

    records.forEach((record) => {
        result.push({id: record.get('ID'), slug: record.get('Slug'), title: record.get('Title'), content: record.get('Content'), highlight: record.get('Highlight')});
    });

    response.send(result[0]);

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();

    // eslint-disable-next-line prefer-arrow-callback
    }, function done(err) {
        if (err) { console.error(err); return; }
    });
});