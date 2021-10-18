import * as express from 'express';
import * as admin from 'firebase-admin';
import {v4 as uuid} from 'uuid';
import {User} from '../../../models/user/user';
import {ErrorService} from '../services/errorService';

const router = express.Router();

router.post('/user', async (req, res) => {
  try {
    const user = req.body as User;
    user.id = uuid();
    await admin.firestore().collection('injuries').doc(user.id).set(user);
    res.status(201).send();
  } catch (err) {
    ErrorService.logError(err, 'userRoutes/post/user', res);
  }
});

module.exports = router;
