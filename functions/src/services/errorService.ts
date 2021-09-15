import { CustomError } from "../../../models/error/customError";
import * as admin from 'firebase-admin';
import { v4 as uuid } from 'uuid';

admin.initializeApp();

export class ErrorService {

  static async logError(err: any, url: string, res: any) {
    if (err instanceof Error) {
      const customError: CustomError = { id: uuid(), route: url, message: err.message };
      await admin.firestore().collection('errorLogs').doc(customError.id).set(customError)
    } else {
      res.status(500).send();
    }
  }
}
