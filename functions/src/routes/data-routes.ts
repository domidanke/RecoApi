import * as express from 'express';
import * as admin from 'firebase-admin';
import {BodyPart} from '../models/shared/body-part';
import {Sport} from '../models/shared/sport';

const router = express.Router();

// * Get Sport Select Options
router.get('/sports', async (req, res) => {
  await admin
    .firestore()
    .collection('sports')
    .get()
    .then((sportSnaps) => {
      const sportList: Sport[] = [];
      for (const doc of sportSnaps.docs) {
        sportList.push(doc.data() as Sport);
      }
      res.status(200).send(sportList);
    });
});

// * Get Body Part Select Options
router.get('/body-parts', async (req, res) => {
  await admin
    .firestore()
    .collection('bodyParts')
    .get()
    .then((sportSnaps) => {
      const bodyPartList: BodyPart[] = [];
      for (const doc of sportSnaps.docs) {
        bodyPartList.push(doc.data() as Sport);
      }
      res.status(200).send(bodyPartList);
    });
});
