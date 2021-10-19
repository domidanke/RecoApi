import * as express from 'express';
import * as admin from 'firebase-admin';
import {v4 as uuid} from 'uuid';
import {Injury} from '../../../models/injury/injury';

const router = express.Router();

router.post('', async (req, res) => {
  const injury = req.body as Injury;
  injury.id = uuid();
  await admin.firestore().collection('injuries').doc(injury.id).set(injury);
  res.status(201).send();
});

module.exports = router;
