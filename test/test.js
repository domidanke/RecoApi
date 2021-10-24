const assert = require('assert');
const firebase = require('@firebase/testing');

const PROJ_ID = 'reco-71aea';
const myAuth = {
  uid: 'kxZvuiYU71dnkbdppxEH9v2oeXI3',
  email: 'domi.tajak@gmail.com',
};

function getFirestore(auth) {
  return firebase
    .initializeTestApp({projectId: PROJ_ID, auth: auth})
    .firestore();
}

describe('Reco App Firestore Access', () => {
  it('Understands basic math', () => {
    assert.equal(2 + 2, 4);
  });

  it('Cannot read from or write to any collection if unauthenticated', async () => {
    const db = getFirestore(null);

    const testBodyPart = db.doc(`bodyParts/testBodyPart`);
    await firebase.assertFails(testBodyPart.set({huan: 'mcNagen'}));
    await firebase.assertFails(testBodyPart.get());
    await firebase.assertFails(testBodyPart.delete());

    const testInjuryType = db.doc(`injuryTypes/testInjuryType`);
    await firebase.assertFails(testInjuryType.set({huan: 'mcNagen'}));
    await firebase.assertFails(testInjuryType.get());
    await firebase.assertFails(testInjuryType.delete());

    const testUser = db.doc(`users/testUser`);
    await firebase.assertFails(testUser.set({huan: 'mcNagen'}));
    await firebase.assertFails(testUser.get());
    await firebase.assertFails(testUser.delete());
  });

  it('Cannot read from or write to any collection even if authenticated', async () => {
    const db = getFirestore(myAuth);

    const testBodyPart = db.doc(`bodyParts/testBodyPart`);
    await firebase.assertFails(testBodyPart.set({huan: 'mcNagen'}));
    await firebase.assertFails(testBodyPart.get());
    await firebase.assertFails(testBodyPart.delete());

    const testInjuryType = db.doc(`injuryTypes/testInjuryType`);
    await firebase.assertFails(testInjuryType.set({huan: 'mcNagen'}));
    await firebase.assertFails(testInjuryType.get());
    await firebase.assertFails(testInjuryType.delete());

    const testUser = db.doc(`users/testUser`);
    await firebase.assertFails(testUser.set({huan: 'mcNagen'}));
    await firebase.assertFails(testUser.get());
    await firebase.assertFails(testUser.delete());
  });
});
