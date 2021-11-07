import {Request, Response, NextFunction} from 'express';

const validateIsCurrentUser = () => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (
      req.body.userId == req.currentUserId ||
      req.params.userId == req.currentUserId
    ) {
      next();
    } else {
      res.status(403).send('You are not authorized for this action');
    }
  };
};

export default validateIsCurrentUser;
