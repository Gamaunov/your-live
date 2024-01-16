import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { ObjectId } from 'mongodb';

import { AuthService } from '../application/auth.service';
import { JwtService } from '../application/jwt.service';
import { SecurityDevicesService } from '../application/securityDevices.service';
import { UsersService } from '../application/users.service';
import { RequestWithBody } from '../shared/types/types';
import { CreateUserModel } from '../models/user/CreateUserModel';
import { UserViewModel } from '../models/user/UserViewModel';
import {
  ConfirmCodeType,
  EmailType,
  NewPasswordRecoveryInputType,
  TokenPayload,
  UserInfoType,
} from '../shared/types/auth/auth-types';
import { PostAuthModel } from '../models/auth/PostAuthModel';
import { UserModel } from '../models/user/UserModel';

@injectable()
export class AuthController {
  constructor(
    @inject(AuthService) protected authService: AuthService,
    @inject(JwtService) protected jwtService: JwtService,
    @inject(SecurityDevicesService)
    protected securityDevicesService: SecurityDevicesService,
    @inject(UsersService) protected usersService: UsersService,
  ) {}
  async registerUser(req: RequestWithBody<CreateUserModel>, res: Response) {
    const user: UserViewModel | null = await this.authService.registerUser(
      req.body.login,
      req.body.email,
      req.body.password,
    );

    return user ? res.sendStatus(204) : res.sendStatus(400);
  }

  async confirmRegistration(
    req: RequestWithBody<ConfirmCodeType>,
    res: Response,
  ) {
    const result: boolean = await this.authService.confirmEmail(req.body.code);

    return result ? res.sendStatus(204) : res.sendStatus(400);
  }

  async emailResending(req: RequestWithBody<EmailType>, res: Response) {
    const result: boolean | null =
      await this.authService.resendConfirmationCode(req.body.email);

    return result ? res.sendStatus(204) : res.sendStatus(400);
  }

  async login(req: RequestWithBody<PostAuthModel>, res: Response) {
    const user: UserModel | null = await this.authService.checkCredentials(
      req.body.loginOrEmail,
      req.body.password,
    );

    if (!user) {
      res.sendStatus(401);
      return;
    }

    const userAgent: string = req.headers['user-agent'] || 'unknown';

    const newAccessToken: string =
      await this.jwtService.createAccessToken(user);
    const newRefreshToken: string =
      await this.jwtService.createRefreshToken(user);

    await this.securityDevicesService.createDevice(
      newRefreshToken,
      req.ip!,
      userAgent,
    );

    res
      .cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
      })
      .status(200)
      .json({ accessToken: newAccessToken });
  }

  async logout(req: Request, res: Response): Promise<void> {
    const user: TokenPayload | null = await this.jwtService.verifyRefreshToken(
      req.cookies.refreshToken,
    );

    if (!user) {
      res.sendStatus(401);
      return;
    }

    await this.securityDevicesService.terminateSession(user.deviceId);

    res.clearCookie('refreshToken', { httpOnly: true, secure: true });
    res.sendStatus(204);
  }

  async passwordRecovery(
    req: RequestWithBody<EmailType>,
    res: Response,
  ): Promise<void> {
    await this.authService.sendPasswordRecoveryCode(req.body.email);
    res.sendStatus(204);
  }

  async changePassword(
    req: RequestWithBody<NewPasswordRecoveryInputType>,
    res: Response,
  ) {
    const user: UserModel | null =
      await this.usersService.findUserByPasswordRecoveryCode(
        req.body.recoveryCode,
      );

    if (!user || user.passwordRecovery.expirationDate! < new Date()) {
      return res.status(400).send({
        errorsMessages: [
          { message: 'recoveryCode is incorrect', field: 'recoveryCode' },
        ],
      });
    }

    const isNewPasswordEqualToOldPassword: UserModel | null =
      await this.authService.checkCredentials(
        user.accountData.email,
        req.body.newPassword,
      );

    if (isNewPasswordEqualToOldPassword) {
      res.sendStatus(401);
      return;
    }

    await this.authService.changePassword(
      req.body.recoveryCode,
      req.body.newPassword,
    );

    return res.sendStatus(204);
  }

  async getAccountInfo(req: RequestWithBody<UserInfoType>, res: Response) {
    if (!req.user) return res.sendStatus(401);

    const userInfo = {
      email: req.user.accountData.email,
      login: req.user.accountData.login,
      userId: req.user._id,
    };

    return res.status(200).send(userInfo);
  }

  async refreshTokens(req: Request, res: Response) {
    const verifiedToken: TokenPayload | null =
      await this.jwtService.verifyRefreshToken(req.cookies.refreshToken);
    const user: UserModel | null = await this.usersService.getUserById(
      new ObjectId(verifiedToken?.userId),
    );

    if (!user) return res.sendStatus(401);

    const newAccessToken: string = await this.jwtService.createAccessToken(
      user,
      verifiedToken?.deviceId,
    );
    const newRefreshToken: string = await this.jwtService.createRefreshToken(
      user,
      verifiedToken?.deviceId,
    );

    const newVerifiedRT: TokenPayload | null =
      await this.jwtService.verifyRefreshToken(newRefreshToken);

    if (!newVerifiedRT) return res.sendStatus(401);

    await this.securityDevicesService.updateDevice(
      req.ip!,
      verifiedToken!.userId.toString(),
      newVerifiedRT!.iat,
    );

    return res
      .cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
      })
      .status(200)
      .send({ accessToken: newAccessToken });
  }
}
