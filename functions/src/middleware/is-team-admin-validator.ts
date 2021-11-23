import {Request, Response, NextFunction} from 'express';
import * as admin from 'firebase-admin';
import {DocumentSnapshot} from 'firebase-functions/v1/firestore';
import {Team} from '../models/team/team';

// ! This middleware requires a teamId property inside the request body or in the params
const validateIsTeamAdmin = () => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const teamId = req.body.teamId ? req.body.teamId : req.params.teamId;
    await admin
      .firestore()
      .collection('teams')
      .doc(teamId)
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
