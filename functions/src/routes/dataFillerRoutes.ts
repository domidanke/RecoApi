import * as express from 'express';
import * as admin from 'firebase-admin';
import {v4 as uuid} from 'uuid';
import {BodyPart} from '../../../models/exercise/body-part';
import {ExerciseType} from '../../../models/exercise/exercise-type';
import {Exercise} from '../../../models/exercise/exercise';
import {InjuryType} from '../../../models/injury/injury-type';
import {InjuryStage} from '../../../models/injury/injury-stage';
import {InjuryStageExercise} from '../../../models/exercise/injury-stage-exercise';
import validateObjectMw from '../middleware/requestValidator';
const bodyPartSchema = require('../../../models/exercise/body-part');

const router = express.Router();

router.post('/bodyPart', validateObjectMw(bodyPartSchema), async (req, res) => {
  const bodyPart: BodyPart = req.body;
  bodyPart.id = uuid();
  await admin.firestore().collection('bodyParts').doc(bodyPart.id).set(bodyPart);
  res.status(201).send();
});

router.post('/injuryType', async (req, res) => {
  const injuryType = req.body as InjuryType;
  injuryType.id = uuid();
  await admin.firestore().collection('injuryTypes').doc(injuryType.id).set(injuryType);
  res.status(201).send('Added Injury Type');
});

router.post('/exerciseType', async (req, res) => {
  const exerciseType = req.body as ExerciseType;
  exerciseType.id = uuid();
  await admin.firestore().collection('exerciseTypes').doc(exerciseType.id).set(exerciseType);
  res.status(201).send('Added Exercise Type');
});

router.post('/exercise', async (req, res) => {
  const exercise = req.body as Exercise;
  exercise.id = uuid();
  await admin.firestore().collection('exercises').doc(exercise.id).set(exercise);
  res.status(201).send('Added Exercise');
});

router.post('/stageExercises', async (req, res) => {
  const injuryStageExercise = req.body as InjuryStageExercise;
  injuryStageExercise.id = uuid();
  await admin.firestore().collection('stageExercises').doc(injuryStageExercise.id)
    .collection('injuryStages').doc(injuryStageExercise.id).set(injuryStageExercise);
  res.status(201).send('Added Injury Stage Exercise');
});

router.post('/injuryType/:injuryTypeId/injuryStage', async (req, res) => {
  const injuryStage = req.body as InjuryStage;
  injuryStage.id = uuid();
  await admin.firestore().collection('injuryTypes').doc(req.params.injuryTypeId)
    .collection('injuryStages').doc(injuryStage.id).set(injuryStage);
  res.status(201).send('Added Injury Stage');
});

module.exports = router;
