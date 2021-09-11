import * as express from 'express';
import * as admin from 'firebase-admin';
import { BodyPartPayload } from "../../../models/exercise/body-part";
import { ExerciseTypePayload } from "../../../models/exercise/exercise-type";
import { ExercisePayload } from "../../../models/exercise/exercise";
import { InjuryPayload } from "../../../models/injury/injury";
import { InjuryTypePayload } from "../../../models/injury/injury-type";
import { InjuryStagePayload } from "../../../models/injury/injury-stage";
import { TeamMemberPayload } from "../../../models/user/team-member";


const router = express.Router();
// The Firebase Admin SDK to access Firestore.
admin.initializeApp();

router.post('/injuryType', async (req, res) => {
  const injuryType: InjuryTypePayload = req.body as InjuryTypePayload;
  await admin.firestore().collection('injuryTypes').add(injuryType);
  res.status(201).send('Added Injury Type');
});

router.post('/bodyPart', async (req, res) => {
  const bodyPart: BodyPartPayload = req.body as BodyPartPayload;
  await admin.firestore().collection('bodyParts').add(bodyPart);
  res.status(201).send('Added Body Part');
});

router.post('/exerciseType', async (req, res) => {
  const exerciseType: ExerciseTypePayload = req.body as ExerciseTypePayload;
  await admin.firestore().collection('exerciseTypes').add(exerciseType);
  res.status(201).send('Added Exercise Type');
});

router.post('/exercise', async (req, res) => {
  const exercise: ExercisePayload = req.body as ExercisePayload;
  await admin.firestore().collection('exercises').add(exercise);
  res.status(201).send('Added Exercise');
});

router.post('/injuryType/:injuryTypeId/injuryStage', async (req, res) => {
  const injuryStage: InjuryStagePayload = req.body as InjuryStagePayload;
  await admin.firestore().collection('injuryTypes').doc(req.params.injuryTypeId)
    .collection('injuryStages').add(injuryStage);
  res.status(201).send('Added Injury Stage');
});

router.post('/team/:teamId/teamMember/:userId', async (req, res) => {
  const teamMember: TeamMemberPayload = req.body as TeamMemberPayload;
  await admin.firestore().collection('teams').doc(req.params.teamId)
    .collection('teamMembers').doc(req.params.userId).set(teamMember);
  res.status(201).send('Added Team Member');
});

router.post('/team/:teamId/injury', async (req, res) => {
  const injury: InjuryPayload = req.body as InjuryPayload;
  await admin.firestore().collection('teams').doc(req.params.teamId)
    .collection('injuries').doc().set(injury);
  res.status(201).send('Added Injury');
});

module.exports = router;
