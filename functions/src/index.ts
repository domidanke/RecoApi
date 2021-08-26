import * as functions from 'firebase-functions';
import * as express from 'express';
import * as admin from 'firebase-admin';

const app = express();
// The Firebase Admin SDK to access Firestore.
admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', {structuredData: true});
  response.send('Hello from Firebase!');
});

exports.dataFillers = functions.https.onRequest(app);

app.post('/injuryType', async (req, res) => {
  await admin.firestore().collection('injuryTypes').add(req.body);
  res.status(201).send('Added Injury Type');
});

app.post('/bodyPart', async (req, res) => {
  await admin.firestore().collection('bodyParts').add(req.body);
  res.status(201).send('Added Body Part');
});

app.post('/exerciseType', async (req, res) => {
  await admin.firestore().collection('exerciseTypes').add(req.body);
  res.status(201).send('Added Exercise Type');
});

app.post('/exercise', async (req, res) => {
  await admin.firestore().collection('exercises').add(req.body);
  res.status(201).send('Added Exercise');
});

app.post('/injuryStage', async (req, res) => {
  await admin.firestore().collection('injuryStages').add(req.body);
  res.status(201).send('Added Injury Stage');
});
