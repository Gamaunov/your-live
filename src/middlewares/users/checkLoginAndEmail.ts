import { NextFunction, Request, Response } from 'express';

import { UsersRepository } from '../../infrastructure/users.repository';
import { UserModel } from '../../models/user/UserModel';

const usersRepository = new UsersRepository();

export const checkLoginAndEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const login: UserModel | null = await usersRepository.findUserByLoginOrEmail(
    req.body.login,
  );
  const email: UserModel | null = await usersRepository.findUserByLoginOrEmail(
    req.body.email,
  );

  if (login) {
    const message = {
      errorsMessages: [
        {
          message: 'login already exist',
          field: 'login',
        },
      ],
    };

    return res.status(400).send(message);
  }

  if (email) {
    const message = {
      errorsMessages: [
        {
          message: 'email already exist',
          field: 'email',
        },
      ],
    };

    return res.status(400).send(message);
  }

  return next();
};
