import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';

import { JwtService } from '../../application/jwt.service';
import { UsersService } from '../../application/users.service';
import { container } from '../../composition-root';
import { TokenPayload } from '../../shared/types/auth/auth-types';
import { UserModel } from '../../models/user/UserModel';

const jwtService = container.resolve(JwtService);
const usersService = container.resolve(UsersService);
export const authBearerMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.headers.authorization) {
    return res.sendStatus(401);
  }

  const token: string = req.headers.authorization.split(' ')[1];
  const verifiedToken: TokenPayload | null =
    await jwtService.verifyAccessToken(token);

  if (verifiedToken) {
    const user: UserModel | null = await usersService.getUserById(
      new ObjectId(verifiedToken.userId),
    );

    if (user) {
      req.user = user;

      return next();
    }
  }

  return res.sendStatus(401);
};
