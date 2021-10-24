import * as express from 'express';
import * as admin from 'firebase-admin';
import {v4 as uuid} from 'uuid';
import {User} from '../models/user/user';

const router = express.Router();

router.post('/user', async (req, res) => {
  const user: User = req.body;
  user.id = uuid();
  user.createdDate = new Date();
  await admin.firestore().collection('injuries').doc(user.id).set(user);
  res.status(201).send();
});

module.exports = router;
