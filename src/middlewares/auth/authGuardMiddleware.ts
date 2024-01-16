import { NextFunction, Request, Response } from 'express';

const expectedAuthHeader = 'admin:qwerty';

export const authGuardMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.sendStatus(401);
  }

  const encodedHeader = authHeader.split(' ')[1];
  const decodedHeader = Buffer.from(encodedHeader, 'base64').toString('utf-8');

  if (decodedHeader !== expectedAuthHeader) {
    return res.status(401).send('encodedHeader');
  }

  return next();
};
