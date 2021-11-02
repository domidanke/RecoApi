import * as express from 'express';
import * as admin from 'firebase-admin';
import {JoinTeamRequest} from '../models/user/join-team-request';

const router = express.Router();

router.get(':teamId/registration-requests', async (req, res) => {
  await admin
    .firestore()
    .collection('joinTeamRequests')
    .where('teamId', '==', req.params.teamId)
    .get()
    .then((snaps) => {
      const jtrList: JoinTeamRequest[] = [];
      for (const doc of snaps.docs) {
        jtrList.push(doc.data() as JoinTeamRequest);
      }
      res.status(200).send(JSON.stringify(jtrList));
    });
});

module.exports = router;
