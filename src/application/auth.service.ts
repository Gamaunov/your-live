import { inject, injectable } from 'inversify';
import bcrypt from 'bcrypt';
import { add } from 'date-fns';
import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import Jwt from 'jsonwebtoken';

import { UsersRepository } from '../infrastructure/users.repository';
import { UserViewModel } from '../models/user/UserViewModel';
import { UserMongooseModel } from '../domain/entities/user.schema';
import { emailManager } from '../managers/email-manager';
import { UserModel } from '../models/user/UserModel';
import { TokenPayload } from '../shared/types/auth/auth-types';
import { jwtConstants } from '../shared/config/constants';

import { UsersService } from './users.service';

@injectable()
export class AuthService {
  constructor(
    @inject(UsersService) protected usersService: UsersService,
    @inject(UsersRepository) protected usersRepository: UsersRepository,
  ) {}
  async registerUser(
    login: string,
    email: string,
    password: string,
  ): Promise<UserViewModel | null> {
    const passwordHash: string = await this._generateHash(password);

    const smartUserModel = await UserMongooseModel.makeInstance(
      login,
      passwordHash,
      email,
    );

    const createdUser = await this.usersRepository.save(smartUserModel);

    try {
      await emailManager.sendEmailConfirmationMessage(
        smartUserModel.accountData.email,
        smartUserModel.emailConfirmation.confirmationCode!,
      );
    } catch (e) {
      console.error(e);
      await this.usersRepository.deleteUser(new ObjectId(smartUserModel._id));
      return null;
    }

    return createdUser;
  }

  async checkCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<UserModel | null> {
    const user: UserModel | null =
      await this.usersService.findUserByLoginOrEmail(loginOrEmail);

    if (!user) return null;

    if (!user.emailConfirmation.isConfirmed) return null;

    const isHashesEquals: boolean = await this._isPasswordCorrect(
      password,
      user.accountData.passwordHash,
    );

    return isHashesEquals ? user : null;
  }

  async _generateHash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async _isPasswordCorrect(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async checkRefreshToken(token: string): Promise<TokenPayload | null> {
    try {
      return Jwt.verify(
        token,
        jwtConstants.refreshTokenSecret!,
      ) as TokenPayload;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async sendPasswordRecoveryCode(email: string): Promise<boolean> {
    const user: UserModel | null =
      await this.usersService.findUserByLoginOrEmail(email);

    if (!user) return false;

    const recoveryCode: string = uuidv4();
    const expirationDate: Date = add(new Date(), {
      hours: 1,
    });

    const updatedPassword: boolean =
      await this.usersRepository.updatePasswordRecovery(
        user._id,
        recoveryCode,
        expirationDate,
      );

    try {
      await emailManager.sendRecoveryPasswordMessage(email, recoveryCode);
    } catch (e) {
      console.error(e);
      return false;
    }
    return updatedPassword;
  }

  async confirmEmail(code: string): Promise<boolean> {
    const user: UserModel | null =
      await this.usersService.findUserByEmailConfirmationCode(code);

    if (!user) return false;

    if (user.emailConfirmation.isConfirmed) return false;

    if (user.emailConfirmation.expirationDate! < new Date()) return false;

    return await this.usersRepository.updateEmailConfirmationStatus(user._id);
  }

  async findUserByEmail(email: string): Promise<UserModel | null> {
    return await this.usersRepository.findUserByEmail(email);
  }

  async resendConfirmationCode(email: string): Promise<boolean | null> {
    const user: UserModel | null = await this.findUserByEmail(email);

    if (!user) return null;

    const newCode: string = uuidv4();

    try {
      await emailManager.sendEmailConfirmationMessage(
        user.accountData.email,
        newCode,
      );
    } catch (e) {
      return null;
    }

    return this.usersRepository.updateConfirmationCode(user._id, newCode);
  }

  async changePassword(
    recoveryCode: string,
    password: string,
  ): Promise<boolean> {
    const user: UserModel | null =
      await this.usersService.findUserByPasswordRecoveryCode(recoveryCode);

    if (!user) return false;

    const passwordHash: string = await this._generateHash(password);

    return this.usersRepository.updatePassword(user._id, passwordHash);
  }
}
