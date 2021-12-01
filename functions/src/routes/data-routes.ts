import * as express from 'express';
import * as admin from 'firebase-admin';
import {BodyPart} from '../models/shared/body-part';
import {Sport} from '../models/shared/sport';
import {TeamMemberType} from '../models/team/team-member-type';

const router = express.Router();

// * Get Sport Select Options
router.get('/sports', async (req, res) => {
  await admin
    .firestore()
    .collection('sports')
    .get()
    .then((sportSnaps) => {
      const sports: Sport[] = [];
      for (const doc of sportSnaps.docs) {
        sports.push(doc.data() as Sport);
      }
      res.status(200).send(sports);
    });
});

// * Get Body Part Select Options
router.get('/body-parts', async (req, res) => {
  await admin
    .firestore()
    .collection('bodyParts')
    .get()
    .then((sportSnaps) => {
      const bodyParts: BodyPart[] = [];
      for (const doc of sportSnaps.docs) {
        bodyParts.push(doc.data() as Sport);
      }
      res.status(200).send(bodyParts);
    });
});

// * Get Body Part Select Options
router.get('/team-member-type', async (req, res) => {
  await admin
    .firestore()
    .collection('teamMemberTypes')
    .get()
    .then((sportSnaps) => {
      const teamMemberTypes: TeamMemberType[] = [];
      for (const doc of sportSnaps.docs) {
        teamMemberTypes.push(doc.data() as TeamMemberType);
      }
      res.status(200).send(teamMemberTypes);
    });
});
