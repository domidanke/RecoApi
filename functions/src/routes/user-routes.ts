import * as express from 'express';
import * as admin from 'firebase-admin';
import {DocumentSnapshot} from 'firebase-functions/v1/firestore';
import {v4 as uuid} from 'uuid';
import {JoinTeamRequest} from '../models/shared/join-team-request';
import validateObjectMw from '../middleware/request-validator';
import {Team} from '../models/team/team';
import {registerUserPayloadSchema} from '../models/user/payloads/register-user';
import {User} from '../models/user/user';

const router = express.Router();

// * Create/Register User
router.post(
  '',
  validateObjectMw(registerUserPayloadSchema),
  async (req, res) => {
    const userToRegister: User = req.body;
    userToRegister.id = req.currentUserId;
    userToRegister.email = req.currentUserEmail;
    userToRegister.createdDate = new Date();
    userToRegister.teamIds = []; // Ensure that property is array and not null
    await admin
      .firestore()
      .collection('users')
      .doc(userToRegister.id)
      .set(userToRegister)
      .then(() => {
        res.status(201).send('Successfully registered User');
      });
  }
);

// * Get User
router.get('', async (req, res) => {
  await admin
    .firestore()
    .collection('users')
    .doc(req.currentUserId)
    .get()
    .then((userSnap: DocumentSnapshot) => {
      if (!userSnap.exists) {
        res.send(404).send('User does not exist');
      } else {
        res.status(200).send(userSnap.data() as User);
      }
    });
});

// * Create Join Team Request
router.post('/join-team-requests/:teamId', async (req, res) => {
  const exists = await joinTeamRequestExists(
    req.currentUserId,
    req.params.teamId
  );
  if (exists) {
    res.send(404).send('Already requesting to join this team');
  } else {
    await admin
      .firestore()
      .collection('teams')
      .doc(req.params.teamId)
      .get()
      .then(async (teamSnap: DocumentSnapshot) => {
        if (!teamSnap.exists) {
          res.send(404).send('Team does not exist');
        } else {
          const team = teamSnap.data() as Team;
          await admin
            .firestore()
            .collection('users')
            .doc(req.currentUserId)
            .get()
            .then(async (userSnap: DocumentSnapshot) => {
              if (!userSnap.exists) {
                res.send(404).send('User does not exist');
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
  }
});

// * Get Join Team Requests
router.get('/join-team-requests', async (req, res) => {
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

// * private functions
async function joinTeamRequestExists(userId: string, teamId: string) {
  return await admin
    .firestore()
    .collection('joinTeamRequests')
    .where('requesterId', '==', userId)
    .get()
    .then((snaps) => {
      for (const doc of snaps.docs) {
        const jtr = doc.data() as JoinTeamRequest;
        if (jtr.teamId === teamId) {
          return true;
        }
      }
      return false;
    });
}

module.exports = router;
