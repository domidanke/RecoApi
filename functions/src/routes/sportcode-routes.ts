import express = require('express');
import * as admin from 'firebase-admin';
import validateIsCurrentUser from '../middleware/current-user-validator';

const router = express.Router();

router.get(
  '/sportCode/:sportCodeId',
  validateIsCurrentUser(),
  async (req, res) => {
    await admin
      .firestore()
      .collection('sportCode')
      .where('sportCodeId', '==', req.params.sportCodeId)
      .get()
      .then((snaps) => {
        res.status(200).send(JSON.stringify(snaps.docs[0]));
      });
  }
);

module.exports = router;
