import * as express from 'express';
import * as admin from 'firebase-admin';
import {v4 as uuid} from 'uuid';
import {Injury} from '../../../models/injury/injury';
import {ErrorService} from '../services/errorService';

const router = express.Router();

router.post('', async (req, res) => {
  try {
    const injury = req.body as Injury;
    injury.id = uuid();
    await admin.firestore().collection('injuries').doc(injury.id).set(injury);
    res.status(201).send();
  } catch (err) {
    ErrorService.logError(err, 'injuryRoutes/post/injury', res);
  }
});

module.exports = router;
