import * as express from 'express';
import * as admin from 'firebase-admin';
import { v4 as uuid } from 'uuid';
import { CustomError } from "../../../models/error/customError";
import { TeamMember } from "../../../models/user/team-member";

const router = express.Router();
// The Firebase Admin SDK to access Firestore.
admin.initializeApp();

router.post('/team/teamMember/', async (req, res) => {
  try {
    const teamMember = req.body as TeamMember;
    teamMember.id = uuid();
    await admin.firestore().collection('teams').doc(teamMember.teamId)
      .collection('teamMembers').doc(teamMember.id).set(teamMember);
    res.status(201).send();
  } catch (err) {
    if (err instanceof Error) {
      const customError: CustomError = { id: uuid(), file: 'teamRoutes.ts', function: 'post/team', message: err.message };
      await admin.firestore().collection('errorLogs').doc(customError.id).set(customError);
  } else {
    res.status(500).send();
  }
  }
});

module.exports = router;