import { NextFunction, Request, Response } from 'express';

import { UsersService } from '../../application/users.service';
import { container } from '../../composition-root';
import { UserModel } from '../../models/user/UserModel';

const usersService = container.resolve(UsersService);

export const checkEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user: UserModel | null = await usersService.findUserByLoginOrEmail(
    req.body.email,
  );

  if (!user) {
    const message = {
      errorsMessages: [
        {
          message: 'Email doesnt exist',
          field: 'email',
        },
      ],
    };

    return res.status(400).send(message);
  }

  if (user.emailConfirmation.isConfirmed) {
    const message = {
      errorsMessages: [
        {
          message: 'Email already confirmed',
          field: 'email',
        },
      ],
    };

    return res.status(400).send(message);
  }

  return next();
};
