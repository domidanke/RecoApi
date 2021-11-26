import {Request, Response, NextFunction} from 'express';
import * as admin from 'firebase-admin';
import {DocumentSnapshot} from 'firebase-functions/v1/firestore';

// ! This middleware requires a teamId property inside the request body or in the params
const validateIsTeamMember = () => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const teamId = req.params.teamId;
    await admin
      .firestore()
      .collection('teams')
      .doc(teamId)
      .collection('teamMembers')
      .doc(req.currentUserId)
      .get()
      .then((snap: DocumentSnapshot) => {
        if (snap.exists) {
          next();
        } else {
          res.status(403).send('You are not part of this team');
        }
      });
  };
};

export default validateIsTeamMember;
