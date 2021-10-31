import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {EventContext} from 'firebase-functions';
import {UserRecord} from 'firebase-functions/v1/auth';
import {OnCreateUser} from '../models/user/user';

const onCreateFirebaseUser = functions.auth
  .user()
  .onCreate(async (newAuthUser: UserRecord, context: EventContext) => {
    const newUser: OnCreateUser = {
      id: newAuthUser.uid,
      email: newAuthUser.email,
      createdDate: new Date(context.timestamp),
    };
    await admin.firestore().collection('users').doc(newUser.id).set(newUser);
  });

module.exports = onCreateFirebaseUser;
