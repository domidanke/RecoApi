import express = require('express');
import * as admin from 'firebase-admin';
import {SportCode} from '../models/sportcode/sport-code';

const router = express.Router();

router.get('/sportCode', async (req, res) => {
  await admin
    .firestore()
    .collection('sportCode')
    .get()
    .then((snaps) => {
      const spList: SportCode[] = [];
      for (const doc of snaps.docs) {
        spList.push(doc.data() as SportCode);
      }
      res.status(200).send(JSON.stringify(spList));
    });
});

module.exports = router;
