import * as express from 'express';
import * as admin from 'firebase-admin';


const router = express.Router();
// The Firebase Admin SDK to access Firestore.
admin.initializeApp();

router.post('/injuryType', async (req, res) => {
  await admin.firestore().collection('injuryTypes').add(req.body);
  res.status(201).send('Added Injury Type');
});

router.post('/bodyPart', async (req, res) => {
  await admin.firestore().collection('bodyParts').add(req.body);
  res.status(201).send('Added Body Part');
});

router.post('/exerciseType', async (req, res) => {
  await admin.firestore().collection('exerciseTypes').add(req.body);
  res.status(201).send('Added Exercise Type');
});

router.post('/exercise', async (req, res) => {
  await admin.firestore().collection('exercises').add(req.body);
  res.status(201).send('Added Exercise');
});

router.post('/injuryStage', async (req, res) => {
  await admin.firestore().collection('injuryStages').add(req.body);
  res.status(201).send('Added Injury Stage');
});

router.post('/teamMember', async (req, res) => {
  res.send('Wow, TeamMeber without Param is working! Scam');
});

router.post('/teamMember/:teamId', async (req, res) => {
  await admin.firestore().collection('teams').doc(req.params.teamId)
    .collection('teamMembers').add(req.body);
  res.status(201).send('Added Team Member');
});

module.exports = router;
