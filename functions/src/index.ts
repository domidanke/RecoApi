const teamRoutes = require('./routes/team-routes');
const injuryRoutes = require('./routes/injury-routes');
const userRoutes = require('./routes/user-routes');
const dataRoutes = require('./routes/data-routes');
import * as functions from 'firebase-functions';
import * as express from 'express';
const firestore = require('@google-cloud/firestore');
const client = new firestore.v1.FirestoreAdminClient();
const validateFirebaseIdToken = require('./middleware/firebase-user-authenticator');
const errorHandler = require('./middleware/error-handler');
const cors = require('cors')({origin: true});
const onCreateTeam = require('./triggers/team-created-trigger');

const app = express();

app.use(cors);
app.use(validateFirebaseIdToken);
app.use('/team', teamRoutes);
app.use('/injury', injuryRoutes);
app.use('/user', userRoutes);
app.use('/data', dataRoutes);
app.use(errorHandler); // ! This needs to be here so the middleware is the last one to be called.

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', {structuredData: true});
  response.send('Hello from Firebase!');
});

exports.reco = functions.https.onRequest(app);

exports.onCreateTeam = onCreateTeam;

exports.scheduledFirestoreExport = functions.pubsub
  .schedule('every monday 03:00')
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
