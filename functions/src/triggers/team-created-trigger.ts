import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {QueryDocumentSnapshot} from 'firebase-functions/v1/firestore';
import {Team} from '../models/team/team';

admin.initializeApp();
// TODO write TEST
const onCreateTeam = functions.firestore
  .document('teams/{teamId}')
  .onCreate((snap: QueryDocumentSnapshot) => {
    const newTeam = snap.data() as Team;
    const arrayUnion = admin.firestore.FieldValue.arrayUnion;
    admin
      .firestore()
      .collection('users')
      .doc(newTeam.creatorId)
      .update({
        'recentTeamId': newTeam.id,
        'teamIds': arrayUnion(newTeam.id),
      });
  });

module.exports = onCreateTeam;
