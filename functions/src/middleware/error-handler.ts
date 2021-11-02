import {Request, Response, NextFunction} from 'express';
import * as admin from 'firebase-admin';
import {v4 as uuid} from 'uuid';

export interface CustomError {
  id: string;
  name: string;
  message: string;
  httpHeaders: string;
  occurred: Date;
}

const errorHandler = async function (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (err instanceof Error) {
    const customError: CustomError = {
      id: uuid(),
      name: err.name,
      httpHeaders: req.rawHeaders.join('; '),
      message: err.message,
      occurred: new Date(),
    };
    await admin
      .firestore()
      .collection('errorLogs')
      .doc(customError.id)
      .set(customError);
    res.status(400).send();
    next();
  } else {
    res.status(400).send();
    next();
  }
};

module.exports = errorHandler;
