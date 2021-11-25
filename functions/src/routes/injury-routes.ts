import * as express from 'express';
import * as admin from 'firebase-admin';
import validateIsCurrentUser from '../middleware/current-user-validator';
import createUserInjuryPayloadSchema, {
  CreateUserInjuryPayload,
  Injury,
  InjuryStage,
} from '../models/injury/injury';
import validateObjectMw from '../middleware/request-validator';
import {StatusError} from '../models/other/status-error';
import {DocumentSnapshot} from 'firebase-functions/v1/firestore';
import {User, UserInjury} from '../models/user/user';

const router = express.Router();

router.post(
  '',
  validateObjectMw(createUserInjuryPayloadSchema),
  validateIsCurrentUser(),
  async (req, res, next) => {
    const injuryPayload = req.body as CreateUserInjuryPayload;
    await admin
      .firestore()
      .collection('users')
      .doc(injuryPayload.userId)
      .get()
      .then(async (userSnap: DocumentSnapshot) => {
        const user = userSnap.data() as User;
        if (user.currentInjury) {
          next(new StatusError(400, 'User already has injury'));
        } else {
          await admin
            .firestore()
            .collection('injuries')
            .where('code', '==', injuryPayload.injury)
            .limit(1)
            .get()
            .then(async (injSnaps) => {
              if (injSnaps.empty) {
                next(new StatusError(404, 'Injury does not exist'));
              } else {
                const injury = injSnaps.docs[0].data() as Injury;
                await admin
                  .firestore()
                  .collection('injuries')
                  .doc(injury.id)
                  .collection('stages')
                  .orderBy('order')
                  .limit(1)
                  .get()
                  .then(async (stageSnap) => {
                    const stage = stageSnap.docs[0].data() as InjuryStage;
                    const newUserInjury: UserInjury = {
                      injury: injury.desc,
                      injuryStage: stage.desc,
                      createdDate: new Date(),
                    };
                    await admin
                      .firestore()
                      .collection('users')
                      .doc(injuryPayload.userId)
                      .update({'currentInjury': newUserInjury});
                    res.status(201).send('Successfully created user injury');
                  });
              }
            });
        }
      });
  }
);

module.exports = router;
