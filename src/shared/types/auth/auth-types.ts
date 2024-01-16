import { ObjectId } from 'mongodb';

export type ConfirmCodeType = {
  code: string;
};

export type EmailType = {
  email: string;
};

export type NewPasswordRecoveryInputType = {
  newPassword: 'string';
  recoveryCode: 'string';
};

export type UserInfoType = {
  email: string;
  login: string;
  userId: ObjectId;
};

export type TokenPayload = {
  userId: number;
  deviceId: string;
  iat: number;
  exp: number;
};
