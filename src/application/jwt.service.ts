import { injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { jwtConstants } from '../shared/config/constants';
import { UserModel } from '../models/user/UserModel';
import { TokenPayload } from '../shared/types/auth/auth-types';

@injectable()
export class JwtService {
  async createAccessToken(
    user: UserModel,
    deviceId: string = uuidv4(),
  ): Promise<string> {
    return jwt.sign(
      { userId: user._id, deviceId },
      jwtConstants.accessTokenSecret!,
      {
        expiresIn: jwtConstants.accessTokenExpirationTime,
      },
    );
  }

  async createRefreshToken(
    user: UserModel,
    deviceId: string = uuidv4(),
  ): Promise<string> {
    return jwt.sign(
      { userId: user._id, deviceId },
      jwtConstants.refreshTokenSecret!,
      {
        expiresIn: jwtConstants.refreshTokenExpirationTime,
      },
    );
  }

  async verifyAccessToken(token: string): Promise<TokenPayload | null> {
    try {
      return jwt.verify(token, jwtConstants.accessTokenSecret!) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload | null> {
    try {
      return jwt.verify(
        token,
        jwtConstants.refreshTokenSecret!,
      ) as TokenPayload;
    } catch (error) {
      return null;
    }
  }
}
