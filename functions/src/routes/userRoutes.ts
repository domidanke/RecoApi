import * as express from 'express';
import * as admin from 'firebase-admin';
import {DocumentSnapshot} from 'firebase-functions/v1/firestore';
import {v4 as uuid} from 'uuid';
import {Team} from '../models/user/team';
import {User} from '../models/user/user';
import {JoinTeamRequest} from '../models/user/join-team-request';

const router = express.Router();

router.post('', async (req, res) => {
  const user: User = req.body;
  user.id = uuid();
  user.createdDate = new Date();
  await admin.firestore().collection('injuries').doc(user.id).set(user);
  res.status(201).send();
});

router.post('/:userId/registration-requests/:teamId', async (req, res) => {
  await admin
    .firestore()
    .collection('teams')
    .doc(req.params.teamId)
    .get()
    .then(async (teamSnap: DocumentSnapshot) => {
      if (!teamSnap.exists) throw new Error('Team does not exist');
      await admin
        .firestore()
        .collection('user')
        .doc(req.params.userId)
        .get()
        .then(async (userSnap: DocumentSnapshot) => {
          if (!userSnap.exists) throw new Error('User does not exist');
          const user = userSnap.data() as User;
          const joinTeamRequest: JoinTeamRequest = {
            id: uuid(),
            userId: req.params.userId,
            username: user.firstName + ' ' + user.lastName,
            teamId: req.params.teamId,
            teamName: (teamSnap.data() as Team).name,
            createdDate: new Date(),
          };
          await admin
            .firestore()
            .collection('joinTeamRequests')
            .doc(joinTeamRequest.id)
            .set(joinTeamRequest);
          res.status(201).send('Successfully sent request to join team.');
        });
    });
});

router.get('/:userId/registration-requests', async (req, res) => {
  await admin
    .firestore()
    .collection('joinTeamRequests')
    .where('userId', '==', req.params.userId)
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
