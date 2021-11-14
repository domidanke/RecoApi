const dataFillerRoutes = require('./routes/data-filler-routes');
const teamRoutes = require('./routes/team-routes');
const injuryRoutes = require('./routes/injury-routes');
const userRoutes = require('./routes/user-routes');
import * as functions from 'firebase-functions';
import * as express from 'express';
const firestore = require('@google-cloud/firestore');
const client = new firestore.v1.FirestoreAdminClient();
const validateFirebaseIdToken = require('./middleware/firebase-user-authenticator');
const errorHandler = require('./middleware/error-handler');
const cors = require('cors')({origin: true});
const onCreateTeam = require('./triggers/team-created-trigger');

const app = express();
// The Firebase Admin SDK to access Firestore.
app.use(cors);
app.use(validateFirebaseIdToken);
app.use(errorHandler);
app.use('/dataFillers', dataFillerRoutes);
app.use('/team', teamRoutes);
app.use('/injury', injuryRoutes);
app.use('/user', userRoutes);

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', {structuredData: true});
  response.send('Hello from Firebase!');
});

exports.helpers = functions.https.onRequest(app);

exports.onCreateTeam = onCreateTeam;

exports.scheduledFirestoreExport = functions.pubsub
  .schedule('every day 03:00')
  .timeZone('Europe/Paris')
  .onRun(() => {
    const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
    const databaseName = client.databasePath(projectId, '(default)');
    const now = new Date().toLocaleDateString('en-us', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    return client
      .exportDocuments({
        name: databaseName,
        outputUriPrefix: `gs://reco-71aea.appspot.com/firestore-backups/${now}`,
        // Leave collectionIds empty to export all collections
        // or set to a list of collection IDs to export,
        // collectionIds: ['users', 'posts']
        collectionIds: [],
      })
      .then((responses: any[]) => {
        const response = responses[0];
        console.log(`Operation Name: ${response['name']}`);
      })
      .catch((err: any) => {
        console.error(err);
        throw new Error('Export operation failed');
      });
  });
