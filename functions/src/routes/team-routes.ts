import * as express from 'express';
import * as admin from 'firebase-admin';
import {JoinTeamRequest} from '../models/team-request/join-team-request';
import validateObjectMw from '../middleware/request-validator';
import jtrDecisionSchema, {
  JoinTeamRequestDecision,
} from '../models/team-request/join-team-request decision';
import validateIsTeamAdmin from '../middleware/is-team-admin-validator';
import {DocumentSnapshot} from 'firebase-functions/v1/firestore';
import {TeamMember} from '../models/user/team-member';

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
        teamMemberTypeCode: payload.memberTypeCode ?? 'PLAY',
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

module.exports = router;
