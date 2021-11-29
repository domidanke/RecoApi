import * as express from 'express';
import * as admin from 'firebase-admin';
import {
  Injury,
  InjuryStage,
  InjuryVm,
  StageExercise,
  StageExerciseVm,
} from '../models/injury/injury';
import {DocumentSnapshot} from 'firebase-functions/v1/firestore';
import {User, UserInjury} from '../models/user/user';
import {Exercise} from '../models/exercise/exercise';

const router = express.Router();

// * Create Injury
router.post('/:injuryId', async (req, res) => {
  await admin
    .firestore()
    .collection('users')
    .doc(req.currentUserId)
    .get()
    .then(async (userSnap: DocumentSnapshot) => {
      const user = userSnap.data() as User;
      if (user.currentInjury) {
        res.status(400).send('User already has injury');
      } else {
        const injSnap = await admin
          .firestore()
          .collection('injuries')
          .doc(req.params.injuryId)
          .get();
        if (!injSnap.exists) {
          res.status(404).send('Injury does not exist');
        } else {
          const injury = injSnap.data() as Injury;
          await injSnap.ref
            .collection('stages')
            .orderBy('order')
            .limit(1)
            .get()
            .then(async (stageSnap) => {
              const stage = stageSnap.docs[0].data() as InjuryStage;
              const newUserInjury: UserInjury = {
                injuryId: injury.id,
                injury: injury.desc,
                injuryStageId: stage.id,
                injuryStage: stage.desc,
                createdDate: new Date(),
              };
              await admin
                .firestore()
                .collection('users')
                .doc(req.currentUserId)
                .update({'currentInjury': newUserInjury});
              res.status(201).send('Successfully created user injury');
            });
        }
      }
    });
});

// * Get Injury Information
router.get('/:injuryId/:stageId', async (req, res) => {
  const injSnap = await admin
    .firestore()
    .collection('injuries')
    .doc(req.params.injuryId)
    .get();
  if (!injSnap.exists) {
    res.status(404).send('Injury does not exist');
  } else {
    const injury = injSnap.data() as Injury;
    await injSnap.ref
      .collection('stages')
      .doc(req.params.stageId)
      .get()
      .then(async (stageSnap) => {
        if (!stageSnap.exists) {
          res.status(404).send('Stage does not exist');
        } else {
          const stage = stageSnap.data() as InjuryStage;
          const exerciseIds = stage.exercises.map((x) => {
            return x.id;
          });
          await admin
            .firestore()
            .collection('exercises')
            .where('id', 'in', exerciseIds)
            .get()
            .then((exSnaps) => {
              const stageExercises: StageExerciseVm[] = [];
              for (const doc of exSnaps.docs) {
                const exercise = doc.data() as Exercise;
                const stageExercise = stage.exercises.find((x) => {
                  x.id == exercise.id;
                }) as StageExercise;
                const stageExerciseVm: StageExerciseVm = {
                  id: exercise.id,
                  code: exercise.code,
                  desc: exercise.desc,
                  details: exercise.details,
                  bodyParts: exercise.bodyParts,
                  break: stageExercise.break,
                  sets: stageExercise?.sets,
                  reps: stageExercise?.reps,
                };
                stageExercises.push(stageExerciseVm);
              }
              const injuryVm: InjuryVm = {
                id: injury.id,
                code: injury.code,
                desc: injury.desc,
                details: injury.details,
                bodyPartCode: injury.bodyPartCode,
                stageId: stage.id,
                stageCode: stage.code,
                stageDesc: stage.desc,
                stageDetails: stage.details,
                icon: stage.icon,
                color: stage.color,
                exercises: stageExercises,
              };
              res.status(200).send(injuryVm);
            });
        }
      });
  }
});

// * Advance Injury to next Stage
router.post('/:injuryId/:stageId/advance', async (req, res) => {
  const injSnap = await admin
    .firestore()
    .collection('injuries')
    .doc(req.params.injuryId)
    .get();
  if (!injSnap.exists) {
    res.status(404).send('Injury does not exist');
  } else {
    await injSnap.ref
      .collection('stages')
      .doc(req.params.stageId)
      .get()
      .then(async (stageSnap) => {
        const stage = stageSnap.data() as InjuryStage;
        if (stage.order == -1) {
          res.status(400).send('You cannot advance in this stage');
        } else {
          await injSnap.ref
            .collection('stages')
            .where('order', '==', stage.order + 1)
            .limit(1)
            .get()
            .then(async (nextStage) => {
              if (nextStage.empty) {
                res.status(400).send('You cannot advance in this stage');
              } else {
                const newStage = nextStage.docs[0].data() as InjuryStage;
                await admin
                  .firestore()
                  .collection('users')
                  .doc(req.currentUserId)
                  .update({
                    'currentInjury.injuryStageId': newStage.id,
                    'currentInjury.injuryStage': newStage.desc,
                  });
                res.status(200).send('Successfully proceeded to next stage');
              }
            });
        }
      });
  }
});

module.exports = router;
