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

exports.user = functions.https.onRequest(app);

app.get('/', async (req, res) => {
  const snapshot = await admin.firestore().collection('users').get();
  const users: UserData[] = [];

  snapshot.forEach((doc) => {
    const userData = new UserData();
    userData.id = doc.id;
    userData.data = doc.data();
    users.push(userData);
  });
  res.status(201).send(JSON.stringify(users));
});

app.get('/:id', async (req, res) => {
  const snapshot = await admin.firestore().collection('users')
      .doc(req.params.id).get();
  const userData = new UserData();
  userData.id = snapshot.id;
  userData.data = snapshot.data();
  res.status(201).send(JSON.stringify(userData));
});

app.post('/', async (req, res) => {
  const user = req.body;
  await admin.firestore().collection('users').add(user);
  res.status(201).send('Worked');
});

class UserData {
  id?: string;
  data?: User;
}

class User {
  email?: string;
  userId?: number;
  created?: Date;
}
