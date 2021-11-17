import {NextFunction, Request, Response} from 'express';
import * as admin from 'firebase-admin';
import {v4 as uuid} from 'uuid';
import {StatusError} from '../models/other/status-error';

export interface CustomError extends Error {
  id: string;
  name: string;
  message: string;
  userId: string;
  url: string;
  method: string;
  occurred: Date;
}

const errorHandler = async function (
  err: Error | StatusError,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const customError: CustomError = {
    id: uuid(),
    name: err.name,
    userId: req.currentUserId,
    url: req.originalUrl,
    method: req.method,
    message: err.message,
    occurred: new Date(),
  };
  await admin
    .firestore()
    .collection('errorLogs')
    .doc(customError.id)
    .set(customError);
  if (err instanceof StatusError) {
    res.status(err.status).send(err.message);
  } else {
    res.status(500).send('Something went wrong');
  }
  next();
};

module.exports = errorHandler;
