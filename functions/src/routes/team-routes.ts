import * as express from 'express';
import * as admin from 'firebase-admin';
import {JoinTeamRequest} from '../models/team-request/join-team-request';
import validateObjectMw from '../middleware/request-validator';
import jtrDecisionSchema, {
  JoinTeamRequestDecision,
} from '../models/team-request/join-team-request decision';
import validateIsTeamAdmin from '../middleware/is-team-admin-validator';
import {TeamMember} from '../models/user/team-member';
import newTeamRegistrationSchema, {Team} from '../models/user/team';
import {v4 as uuid} from 'uuid';

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
  ':teamId/registration-requests',
  validateObjectMw(jtrDecisionSchema),
  validateIsTeamAdmin(),
  async (req, res) => {
    const payload = req.body as JoinTeamRequestDecision;
    if (payload.accepted) {
      const newTeamMember: TeamMember = {
        userId: payload.requesterId,
        active: true,
        teamMemberTypeCode: payload.teamMemberTypeCode ?? 'PLAY',
        joinedDate: new Date(),
      };
      await admin
        .firestore()
        .collection('teams')
        .doc(req.params.teamId)
        .collection('teamMembers')
        .doc(newTeamMember.userId)
        .set(newTeamMember);
    }

    await admin
      .firestore()
      .collection('joinTeamRequests')
      .doc(payload.id)
      .delete()
      .then(() => {
        res.status(201).send('Successfully added new team member');
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
