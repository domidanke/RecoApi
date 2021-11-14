import {Request, Response, NextFunction} from 'express';
import * as admin from 'firebase-admin';
import {DocumentSnapshot} from 'firebase-functions/v1/firestore';
import {Team} from '../models/team/team';

// ! This middleware requires a teamId param inside the route
const validateIsTeamAdmin = () => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    await admin
      .firestore()
      .collection('teams')
      .doc(req.params.teamId)
      .get()
      .then((snap: DocumentSnapshot) => {
        const team = snap.data() as Team;
        if (team.admins.includes(req.currentUserId)) {
          next();
        } else {
          res.status(403).send('You are not authorized for this action');
        }
      });
  };
};

export default validateIsTeamAdmin;
