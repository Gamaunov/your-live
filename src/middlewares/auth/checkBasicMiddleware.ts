import { NextFunction, Request, Response } from 'express';

import { basicAuthConstants } from '../../shared/config/constants';

export const checkBasicMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  const encodedCredentials = Buffer.from(
    `${basicAuthConstants.username}:${basicAuthConstants.password}`,
  ).toString('base64');

  if (authHeader !== `Basic ${encodedCredentials}`) {
    res.sendStatus(401);
  } else {
    next();
  }
};
