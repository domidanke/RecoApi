import * as express from 'express';
import * as admin from 'firebase-admin';
import {DocumentSnapshot} from 'firebase-functions/v1/firestore';
import {v4 as uuid} from 'uuid';
import {Team} from '../models/user/team';
import validateIsCurrentUser from '../middleware/current-user-validator';
import {JoinTeamRequest} from '../models/team-request/join-team-request';
import validateObjectMw from '../middleware/request-validator';
import newUserRegistrationSchema, {
  NewUserRegistration,
  User,
} from '../models/user/user';

const router = express.Router();

router.post(
  '/registration-requests/:teamId',
  validateIsCurrentUser(),
  async (req, res) => {
    await admin
      .firestore()
      .collection('teams')
      .doc(req.params.teamId)
      .get()
      .then(async (teamSnap: DocumentSnapshot) => {
        if (!teamSnap.exists) throw new Error('Team does not exist');
        const team = teamSnap.data() as Team;
        await admin
          .firestore()
          .collection('user')
          .doc(req.currentUserId)
          .get()
          .then(async (userSnap: DocumentSnapshot) => {
            if (!userSnap.exists) throw new Error('User does not exist');
            const user = userSnap.data() as User;
            const joinTeamRequest: JoinTeamRequest = {
              id: uuid(),
              requesterId: user.id,
              requesterName: user.firstName + ' ' + user.lastName,
              teamId: team.id,
              teamName: team.name,
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
  }
);

router.get('/registration-requests', async (req, res) => {
  await admin
    .firestore()
    .collection('joinTeamRequests')
    .where('requesterId', '==', req.currentUserId)
    .get()
    .then((snaps) => {
      const jtrList: JoinTeamRequest[] = [];
      for (const doc of snaps.docs) {
        jtrList.push(doc.data() as JoinTeamRequest);
      }
      res.status(200).send(JSON.stringify(jtrList));
    });
});

router.get('/:userId', async (req, res) => {
  await admin
    .firestore()
    .collection('users')
    .doc(req.params.userId)
    .get()
    .then((snap: DocumentSnapshot) => {
      const user = snap.data() as User;
      res.status(200).send(JSON.stringify(user));
    });
});

router.post(
  '/create-user',
  validateObjectMw(newUserRegistrationSchema),
  async (req, res) => {
    const user: NewUserRegistration = req.body;
    user.id = uuid();
    await admin
      .firestore()
      .collection('users')
      .doc(user.id)
      .set(user)
      .then(() => {
        res.status(201).send('New User Successfully registered');
      });
  }
);

module.exports = router;
