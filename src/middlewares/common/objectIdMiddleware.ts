import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';

export function validateObjectId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!ObjectId.isValid(req.params.id)) {
    return res.sendStatus(404);
  }

  return next();
}
