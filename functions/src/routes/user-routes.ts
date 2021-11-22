import * as express from 'express';
import * as admin from 'firebase-admin';
import {DocumentSnapshot} from 'firebase-functions/v1/firestore';
import {v4 as uuid} from 'uuid';
import validateIsCurrentUser from '../middleware/current-user-validator';
import {JoinTeamRequest} from '../models/team-request/join-team-request';
import validateObjectMw from '../middleware/request-validator';
import {Team} from '../models/team/team';
import {registerUserPayloadSchema} from '../models/user/payloads/register-user';
import {User} from '../models/user/user';
import {StatusError} from '../models/other/status-error';

const router = express.Router();

router.post('/registration-requests/:teamId', async (req, res, next) => {
  await admin
    .firestore()
    .collection('teams')
    .doc(req.params.teamId)
    .get()
    .then(async (teamSnap: DocumentSnapshot) => {
      if (!teamSnap.exists) {
        next(new StatusError(404, 'Team does not exist'));
      } else {
        const team = teamSnap.data() as Team;
        await admin
          .firestore()
          .collection('users')
          .doc(req.currentUserId)
          .get()
          .then(async (userSnap: DocumentSnapshot) => {
            if (!userSnap.exists) {
              next(new StatusError(404, 'User does not exist'));
            } else {
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
            }
          });
      }
    });
});

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
      res.status(200).send(jtrList);
    });
});

router.get('/:userId', validateIsCurrentUser(), async (req, res, next) => {
  await admin
    .firestore()
    .collection('users')
    .doc(req.params.userId)
    .get()
    .then((userSnap: DocumentSnapshot) => {
      if (!userSnap.exists) {
        next(new StatusError(404, 'User does not exist'));
      } else {
        const user = userSnap.data() as User;
        res.status(200).send(user);
      }
    });
});

router.post(
  '',
  validateObjectMw(registerUserPayloadSchema),
  validateIsCurrentUser(),
  async (req, res) => {
    const userToRegister: User = req.body;
    userToRegister.createdDate = new Date();
    userToRegister.teamIds = []; // Ensure that property is array and not null
    await admin
      .firestore()
      .collection('users')
      .doc(userToRegister.id)
      .set(userToRegister)
      .then(() => {
        res.status(201).send('User Successfully registerd');
      });
  }
);

module.exports = router;
