import {Firestore} from '@google-cloud/firestore';

const COLLECTION = 'projects' // Collection name
// Create the DB session
const db = new Firestore({
  projectId: 'firestore-dm',
  keyFileName: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

db.collection(COLLECTION).get().then((collections) => {
  const index = collections.size;
  const data = {
    'id': index,
    'name': ('Project #' + index),
    'description': 'Lorem ipsum',
  };

  db.collection(COLLECTION).add(data).then((res) => {
    console.log('Succesfully added:', res);
  }).catch((err) => {
    console.error(err);
  });
}).catch((err) => {
  console.error(err);
});
