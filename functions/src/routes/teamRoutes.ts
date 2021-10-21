import * as express from 'express';
import * as admin from 'firebase-admin';
import {v4 as uuid} from 'uuid';
import {TeamMember} from '../../../models/user/team-member';

const router = express.Router();

router.post('/teamMember', async (req, res) => {
  const teamMember = req.body as TeamMember;
  teamMember.id = uuid();
  await admin
    .firestore()
    .collection('teams')
    .doc(teamMember.teamId)
    .collection('teamMembers')
    .doc(teamMember.id)
    .set(teamMember);
  res.status(201).send();
});

module.exports = router;
