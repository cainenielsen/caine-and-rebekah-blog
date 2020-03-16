/* eslint-disable promise/always-return */
const cors = require('cors')({origin: true});

const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp({
    credential: admin.credential.applicationDefault()
});
  
const db = admin.firestore();







exports.createUser = functions.auth.user().onCreate((user) => {
    var userData = {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber,
        status: 'active'
    };

    let setDoc = db.collection('users').doc(userData.uid).set(userData);
});

exports.archiveUser = functions.auth.user().onDelete((user) => {
    var userData = {
        uid: user.uid,
    };

    let docRef = db.collection('users').doc(userData.uid);
    let updateSingle = docRef.update({status: 'inactive'});
});

function configureAirTable() {

    // baseId = appSmEDkgeVZeg7s9

    var docRef = db.collection("users").doc("d1caO40ZxBOrO3WGlIQMOwky3xR2");
    docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());


        var Airtable = require('airtable');
        Airtable.configure({
            endpointUrl: 'https://api.airtable.com',
            apiKey: 'keyK6w3Ul4xNMUDhj'
        });

        const base = Airtable.base(baseId);

        collectTable(base);

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}


exports.loadTable = functions.https.onRequest((request, response) => {
    var search = request.query.slug;
    console.log(search);
    var find = 'SEARCH("' + search + '",{Slug})';
    
    const base = configureAirTable();

});

function collectTable() {
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
}
    
