import { injectable } from 'inversify';
import { DeleteResult, ObjectId } from 'mongodb';
import { HydratedDocument, UpdateWriteOpResult } from 'mongoose';

import {
  IUser,
  IUserMethods,
  UserMongooseModel,
} from '../domain/entities/user.schema';
import { UserDBModel } from '../models/db/UserDBModel';
import { UserViewModel } from '../models/user/UserViewModel';
import { UserModel } from '../models/user/UserModel';

@injectable()
export class UsersRepository {
  async findUserById(
    _id: ObjectId,
  ): Promise<HydratedDocument<UserDBModel> | null> {
    const foundUser = await UserMongooseModel.findOne({ _id });

    return foundUser ? foundUser : null;
  }

  async findUserByEmailConfirmationCode(
    code: string,
  ): Promise<HydratedDocument<IUser, IUserMethods> | null> {
    return UserMongooseModel.findOne({
      'emailConfirmation.confirmationCode': code,
    });
  }

  async findUserByPasswordRecoveryCode(
    code: string,
  ): Promise<HydratedDocument<UserDBModel> | null> {
    const foundUser = await UserMongooseModel.findOne({
      'passwordRecovery.recoveryCode': code,
    });

    return foundUser ? foundUser : null;
  }

  async updatePasswordRecovery(
    _id: ObjectId,
    recoveryCode: string,
    expirationDate: Date,
  ): Promise<boolean> {
    const result: UpdateWriteOpResult = await UserMongooseModel.updateOne(
      { _id },
      {
        $set: {
          'passwordRecovery.recoveryCode': recoveryCode,
          'passwordRecovery.expirationDate': expirationDate,
        },
      },
    );
    return result.modifiedCount === 1;
  }

  async updatePassword(_id: ObjectId, passwordHash: string): Promise<boolean> {
    const result: UpdateWriteOpResult = await UserMongooseModel.updateOne(
      { _id },
      {
        $set: {
          'accountData.passwordHash': passwordHash,
          'passwordRecovery.recoveryCode': null,
          'passwordRecovery.expirationDate': null,
        },
      },
    );
    return result.modifiedCount === 1;
  }

  async updateEmailConfirmationStatus(_id: ObjectId): Promise<boolean> {
    const result: UpdateWriteOpResult = await UserMongooseModel.updateOne(
      { _id },
      { $set: { 'emailConfirmation.isConfirmed': true } },
    );
    return result.modifiedCount === 1;
  }

  async createUser(newUser: UserDBModel): Promise<UserViewModel> {
    const user = await UserMongooseModel.create(newUser);
    await user.save();

    return {
      id: user._id.toString(),
      login: user.accountData.login,
      email: user.accountData.email,
      createdAt: user.accountData.createdAt,
    };
  }

  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserDBModel | null> {
    return UserMongooseModel.findOne({
      $or: [
        { 'accountData.login': loginOrEmail },
        { 'accountData.email': loginOrEmail },
      ],
    });
  }

  async findUserByEmail(email: string): Promise<UserModel | null> {
    const user = await UserMongooseModel.findOne({
      'accountData.email': email,
    });

    return user ? user : null;
  }

  async findUserByLogin(login: string): Promise<UserModel | null> {
    const user = await UserMongooseModel.findOne({
      'accountData.login': login,
    });

    return user ? user : null;
  }

  async updateConfirmationCode(
    userId: ObjectId,
    code: string,
  ): Promise<boolean> {
    const result: UpdateWriteOpResult = await UserMongooseModel.updateOne(
      { _id: userId },
      {
        $set: {
          'emailConfirmation.confirmationCode': code,
        },
      },
    );

    return result.modifiedCount === 1;
  }

  async deleteUser(_id: ObjectId): Promise<boolean> {
    const result: DeleteResult = await UserMongooseModel.deleteOne({ _id });

    return result.deletedCount === 1;
  }

  async deleteAllUsers(): Promise<boolean> {
    await UserMongooseModel.deleteMany({});
    return (await UserMongooseModel.countDocuments()) === 0;
  }

  async save(model: any) {
    return await model.save();
  }
}
