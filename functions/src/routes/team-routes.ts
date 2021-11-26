import * as express from 'express';
import * as admin from 'firebase-admin';
import {JoinTeamRequest} from '../models/team-request/join-team-request';
import validateObjectMw from '../middleware/request-validator';
import jtrDecisionSchema, {
  JoinTeamRequestDecisionPayload,
} from '../models/team-request/join-team-request decision';
import validateIsTeamAdmin from '../middleware/is-team-admin-validator';
import {TeamMember} from '../models/team/team-member';
import {v4 as uuid} from 'uuid';
import newTeamRegistrationSchema, {Team} from '../models/team/team';
import validateIsTeamMember from '../middleware/is-team-member-validator';
import {User} from '../models/user/user';

const router = express.Router();

router.get(
  '/:teamId/registration-requests',
  validateIsTeamAdmin(),
  async (req, res) => {
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
        res.status(200).send(jtrList);
      });
  }
);

router.post('/registration-request', async (req, res) => {
  const payload = req.body as JoinTeamRequest;
  await admin
    .firestore()
    .collection('joinTeamRequests')
    .doc(payload.id)
    .set(payload)
    .then(() => {
      res.status(201).send('Successfully added JoinTeamRequest');
    });
});

router.post(
  '/registration-requests',
  validateObjectMw(jtrDecisionSchema),
  validateIsTeamAdmin(),
  async (req, res) => {
    const payload = req.body as JoinTeamRequestDecisionPayload;
    if (payload.accepted) {
      const newTeamMember: TeamMember = {
        id: payload.requesterId,
        active: true,
        teamMemberTypeCode: payload.teamMemberTypeCode ?? 'PLAY',
        joinedDate: new Date(),
        nickName: '',
      };
      await admin
        .firestore()
        .collection('teams')
        .doc(payload.teamId)
        .collection('teamMembers')
        .doc(newTeamMember.id)
        .set(newTeamMember);

      const arrayUnion = admin.firestore.FieldValue.arrayUnion;
      await admin
        .firestore()
        .collection('users')
        .doc(payload.requesterId)
        .update({
          'recentTeamId': payload.teamId,
          'teamIds': arrayUnion(payload.teamId),
        });
    }

    await admin
      .firestore()
      .collection('joinTeamRequests')
      .doc(payload.id)
      .delete()
      .then(() => {
        const resMessage = payload.accepted
          ? 'Successfully added new team member'
          : 'Request to join team declined';
        res.status(201).send(resMessage);
      });
  }
);

router.post(
  '',
  validateObjectMw(newTeamRegistrationSchema),
  async (req, res) => {
    const team: Team = req.body;
    team.id = uuid();
    team.creatorId = req.currentUserId;
    team.createdDate = new Date();
    team.admins = [req.currentUserId];
    await admin
      .firestore()
      .collection('teams')
      .doc(team.id)
      .set(team)
      .then(() => {
        res.status(201).send('Successfully created new Team');
      });
  }
);

router.get('/:teamId/injuries', validateIsTeamMember(), async (req, res) => {
  await admin
    .firestore()
    .collection('teams')
    .doc(req.params.teamId)
    .collection('teamMembers')
    .get()
    .then(async (memberSnaps) => {
      const memberIds: string[] = [];
      for (const doc of memberSnaps.docs) {
        const member = doc.data() as TeamMember;
        memberIds.push(member.id);
      }
      await admin
        .firestore()
        .collection('users')
        .where('id', 'in', memberIds)
        .get()
        .then((userSnaps) => {
          const users: User[] = [];
          for (const doc of userSnaps.docs) {
            const user = doc.data() as User;
            if (user.currentInjury) users.push(user);
          }
          res.status(200).send(users);
        });
    });
});

module.exports = router;
