import { WithId } from 'mongodb';

export type UserModel = WithId<{
  accountData: {
    login: string;
    passwordHash: string;
    email: string;
    createdAt: string;
    isMembership: boolean;
  };
  emailConfirmation: {
    confirmationCode: string | null;
    expirationDate: Date | null;
    isConfirmed: boolean;
  };
  passwordRecovery: {
    recoveryCode: string | null;
    expirationDate: Date | null;
  };
}>;
