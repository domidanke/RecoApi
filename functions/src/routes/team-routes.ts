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

const router = express.Router();

router.get(
  ':teamId/registration-requests',
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
        res.status(200).send(JSON.stringify(jtrList));
      });
  }
);

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

module.exports = router;
