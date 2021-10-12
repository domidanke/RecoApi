import * as express from 'express';
import * as admin from 'firebase-admin';
import {v4 as uuid} from 'uuid';
import {TeamMember} from '../../../models/user/team-member';
import {ErrorService} from '../services/errorService';

const router = express.Router();

router.post('/teamMember', async (req, res) => {
  try {
    const teamMember = req.body as TeamMember;
    teamMember.id = uuid();
    await admin.firestore().collection('teams').doc(teamMember.teamId)
      .collection('teamMembers').doc(teamMember.id).set(teamMember);
    res.status(201).send();
  } catch (err) {
    ErrorService.logError(err, 'teamRoutes/post/team/teamMember', res);
  }
});

module.exports = router;
