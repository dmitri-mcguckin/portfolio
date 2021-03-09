"use strict";
exports.__esModule = true;
var firestore_1 = require("@google-cloud/firestore");
var COLLECTION = 'projects'; // Collection name
// Create the DB session
var db = new firestore_1.Firestore({
    projectId: 'firestore-dm',
    keyFileName: process.env.GOOGLE_APPLICATION_CREDENTIALS
});
db.collection(COLLECTION).get().then(function (collections) {
    var index = collections.size;
    var data = {
        'id': index,
        'name': ('Project #' + index),
        'description': 'Lorem ipsum'
    };
    db.collection(COLLECTION).add(data).then(function (res) {
        console.log('Succesfully added:', res);
    })["catch"](function (err) {
        console.error(err);
    });
})["catch"](function (err) {
    console.error(err);
});
// db.collection('projects').add({
//   'name': 'Something'
// })
// Get data
// db.collection('projects').get().then((snapshot) => {
//   snapshot.forEach((doc) => {
//     console.log('Document:', doc.id, '->', doc.data());
//   });
// }).catch((err) => {
//   console.error('There was a problem fetching the documents:', err);
// });
