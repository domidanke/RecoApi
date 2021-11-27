import * as express from 'express';
import * as admin from 'firebase-admin';
import {Injury, InjuryStage} from '../models/injury/injury';
import {DocumentSnapshot} from 'firebase-functions/v1/firestore';
import {User, UserInjury} from '../models/user/user';

const router = express.Router();

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

module.exports = router;
