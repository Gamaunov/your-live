import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongodb';

import { JwtService } from '../../application/jwt.service';
import { UsersService } from '../../application/users.service';
import { container } from '../../composition-root';
import { TokenPayload } from '../../shared/types/auth/auth-types';

const jwtService = container.resolve(JwtService);
const usersService = container.resolve(UsersService);

export const tokenParser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const accessToken = req.headers.authorization?.split(' ')[1];

  if (accessToken) {
    const verifiedToken: TokenPayload | null =
      await jwtService.verifyAccessToken(accessToken);

    req.user = await usersService.getUserById(
      new ObjectId(verifiedToken?.userId),
    );
  }

  next();
};
