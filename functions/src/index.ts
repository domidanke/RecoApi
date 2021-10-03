const dataFillerRoutes = require('./routes/dataFillerRoutes');
const teamRoutes = require('./routes/teamRoutes');
const injuryRoutes = require('./routes/injuryRoutes');
import * as functions from 'firebase-functions';
import * as express from 'express';

const app = express();

app.use('/dataFillers', dataFillerRoutes);
app.use('/team', teamRoutes);
app.use('/injury', injuryRoutes);

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', {structuredData: true});
  response.send('Hello from Firebase!');
});

exports.helpers = functions.https.onRequest(app);
