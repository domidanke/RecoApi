import {AnySchema, ValidationError} from 'yup';
// Validate that a resource being POSTed or PUT
// has a valid shape, else return 400 Bad Request

import {Request, Response, NextFunction} from 'express';

// @param {*} resourceSchema is a yup schema
const validateResourceMw = (resourceSchema: AnySchema) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const resource = req.body;
    try {
      // throws an error if not valid
      await resourceSchema.validate(resource);
      next();
    } catch (err) {
      if (err instanceof ValidationError) {
        console.error(err);
        res.status(400).json({errors: err.errors.join('; ')});
      } else {
        res.status(500).send();
      }
    }
  };
};

export default validateResourceMw;
