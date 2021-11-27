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

router.post(
  '/:teamId/registration-requests',
  validateObjectMw(jtrDecisionSchema),
  validateIsTeamAdmin(),
  async (req, res) => {
    const payload = req.body as JoinTeamRequestDecisionPayload;
    if (payload.accepted) {
      const newTeamMember: TeamMember = {
        id: payload.requesterId,
        active: true,
        teamMemberTypeCode: payload.teamMemberTypeCode ?? 'PLAY',
        dateJoined: new Date(),
        nickName: '',
      };
      await admin
        .firestore()
        .collection('teams')
        .doc(req.params.teamId)
        .collection('teamMembers')
        .doc(newTeamMember.id)
        .set(newTeamMember);

      const arrayUnion = admin.firestore.FieldValue.arrayUnion;
      await admin
        .firestore()
        .collection('users')
        .doc(payload.requesterId)
        .update({
          'recentTeamId': req.params.teamId,
          'teamIds': arrayUnion(req.params.teamId),
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
      .then(async () => {
        const firstMember: TeamMember = {
          id: req.currentUserId,
          dateJoined: team.createdDate,
          teamMemberTypeCode: 'COA',
          active: true,
          nickName: '',
        };
        await admin
          .firestore()
          .collection('teams')
          .doc(team.id)
          .collection('teamMembers')
          .doc(firstMember.id)
          .set(firstMember)
          .then(() => {
            res.status(201).send('Successfully created new Team');
          });
      });
  }
);

router.get('/:teamId/members', validateIsTeamMember(), async (req, res) => {
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
            users.push(doc.data() as User);
          }
          res.status(200).send(users);
        });
    });
});

router.post(
  '/:teamId/add-admin/:userId',
  validateIsTeamAdmin(),
  async (req, res) => {
    if (await isTeamMember(req.params.userId, req.params.teamId)) {
      const arrayUnion = admin.firestore.FieldValue.arrayUnion;
      await admin
        .firestore()
        .collection('teams')
        .doc(req.params.teamId)
        .update({
          'admins': arrayUnion(req.params.userId),
        });
      res.status(201).send('Successfully added admin');
    } else {
      res.status(400).send('User is not part of this team');
    }
  }
);

router.post(
  '/:teamId/remove-admin/:userId',
  validateIsTeamAdmin(),
  async (req, res) => {
    if (await isTeamMember(req.params.userId, req.params.teamId)) {
      const arrayRemove = admin.firestore.FieldValue.arrayRemove;
      const doc = admin.firestore().collection('teams').doc(req.params.teamId);
      const x = await doc.get();
      const team = x.data() as Team;
      if (!team.admins.includes(req.params.userId)) {
        res.status(400).send('User is not an admin');
      } else {
        if (team.admins.length > 1) {
          doc.update({
            'admins': arrayRemove(req.params.userId),
          });
          res.status(200).send('Successfully removed admin');
        } else {
          res.status(400).send('You cannot remove the last admin');
        }
      }
    } else {
      res.status(400).send('User is not part of this team');
    }
  }
);

router.post(
  '/:teamId/remove-user/:userId',
  validateIsTeamAdmin(),
  async (req, res) => {
    if (await isTeamMember(req.params.userId, req.params.teamId)) {
      if (!(await isTeamAdmin(req.params.userId, req.params.teamId))) {
        await admin
          .firestore()
          .collection('teams')
          .doc(req.params.teamId)
          .collection('teamMembers')
          .doc(req.params.userId)
          .delete();
        res.status(200).send('Successfully removed Team Member');
      } else {
        res.status(400).send('Can´t delete Admin from Team');
      }
    } else {
      res.status(400).send('User is not part of this team');
    }
  }
);

async function isTeamAdmin(userId: string, teamId: string): Promise<boolean> {
  return await admin
    .firestore()
    .collection('teams')
    .doc(teamId)
    .get()
    .then((snap) => {
      const team = snap.data() as Team;
      return team.admins.includes(userId);
    });
}

async function isTeamMember(userId: string, teamId: string): Promise<boolean> {
  return await admin
    .firestore()
    .collection('teams')
    .doc(teamId)
    .collection('teamMembers')
    .doc(userId)
    .get()
    .then((snap) => snap.exists);
}

module.exports = router;
