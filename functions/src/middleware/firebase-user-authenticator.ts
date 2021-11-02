import {NextFunction, Request, Response} from 'express';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const validateFirebaseIdToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  functions.logger.log('Check if request is authorized with Firebase ID token');
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    functions.logger.log('Found "Authorization" header');
    try {
      await admin
        .auth()
        .verifyIdToken(req.headers.authorization.split('Bearer ')[1])
        .then((decodedToken: unknown) => {
          functions.logger.log('ID Token correctly decoded', decodedToken);
          next();
        });
    } catch (error) {
      functions.logger.error('Error while verifying Firebase ID token:', error);
      res.status(403).send('Unauthorized');
      return;
    }
  } else {
    functions.logger.error(
      'No Firebase ID token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
      'Authorization: Bearer <Firebase ID Token>'
    );
    res.status(403).send('Unauthorized');
    return;
  }
};

module.exports = validateFirebaseIdToken;
