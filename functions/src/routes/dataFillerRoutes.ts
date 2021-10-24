import * as express from 'express';
import * as admin from 'firebase-admin';
import {v4 as uuid} from 'uuid';
import bodyPartSchema, {BodyPart} from '../models/exercise/body-part';
import exerciseTypeSchema, {
  ExerciseType,
} from '../models/exercise/exercise-type';
import {Exercise} from '../models/exercise/exercise';
import injuryTypeSchema, {InjuryType} from '../models/injury/injury-type';
import {InjuryStage} from '../models/injury/injury-stage';
import {InjuryStageExercise} from '../models/exercise/injury-stage-exercise';
import validateObjectMw from '../middleware/requestValidator';

const router = express.Router();

router.post('/bodyPart', validateObjectMw(bodyPartSchema), async (req, res) => {
  const bodyPart: BodyPart = req.body;
  bodyPart.id = uuid() as string;
  await admin
    .firestore()
    .collection('bodyParts')
    .doc(bodyPart.id)
    .set(bodyPart);
  res.status(201).send();
});

router.post(
  '/injuryType',
  validateObjectMw(injuryTypeSchema),
  async (req, res) => {
    const injuryType: InjuryType = req.body;
    injuryType.id = uuid() as string;
    await admin
      .firestore()
      .collection('injuryTypes')
      .doc(injuryType.id)
      .set(injuryType);
    res.status(201).send('Added Injury Type');
  }
);

router.post(
  '/exerciseType',
  validateObjectMw(exerciseTypeSchema),
  async (req, res) => {
    const exerciseType: ExerciseType = req.body;
    exerciseType.id = uuid();
    await admin
      .firestore()
      .collection('exerciseTypes')
      .doc(exerciseType.id)
      .set(exerciseType);
    res.status(201).send('Added Exercise Type');
  }
);

router.post('/exercise', async (req, res) => {
  const exercise = req.body as Exercise;
  exercise.id = uuid();
  await admin
    .firestore()
    .collection('exercises')
    .doc(exercise.id)
    .set(exercise);
  res.status(201).send('Added Exercise');
});

router.post('/stageExercises', async (req, res) => {
  const injuryStageExercise = req.body as InjuryStageExercise;
  injuryStageExercise.id = uuid();
  await admin
    .firestore()
    .collection('stageExercises')
    .doc(injuryStageExercise.id)
    .collection('injuryStages')
    .doc(injuryStageExercise.id)
    .set(injuryStageExercise);
  res.status(201).send('Added Injury Stage Exercise');
});

router.post('/injuryType/:injuryTypeId/injuryStage', async (req, res) => {
  const injuryStage = req.body as InjuryStage;
  injuryStage.id = uuid();
  await admin
    .firestore()
    .collection('injuryTypes')
    .doc(req.params.injuryTypeId)
    .collection('injuryStages')
    .doc(injuryStage.id)
    .set(injuryStage);
  res.status(201).send('Added Injury Stage');
});

module.exports = router;
