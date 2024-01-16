import { NextFunction, Request, Response } from 'express';

import { UsersService } from '../../application/users.service';
import { container } from '../../composition-root';
import { UserModel } from '../../models/user/UserModel';

const usersService = container.resolve(UsersService);
export const checkEmailCode = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const foundUser: UserModel | null =
    await usersService.findUserByEmailConfirmationCode(req.body.code);

  if (!foundUser) {
    res.sendStatus(404);
    return;
  }

  if (foundUser?.emailConfirmation.isConfirmed) {
    const message = {
      errorsMessages: [
        {
          message: 'code already confirmed',
          field: 'code',
        },
      ],
    };

    return res.status(400).send(message);
  }

  if (foundUser?.emailConfirmation.confirmationCode !== req.body.code) {
    const message = {
      errorsMessages: [
        {
          message: 'Confirmation code is incorrect',
          field: 'code',
        },
      ],
    };

    return res.status(400).send(message);
  }

  if (foundUser.emailConfirmation.expirationDate) {
    if (foundUser.emailConfirmation.expirationDate < new Date()) {
      const message = {
        errorsMessages: [
          {
            message: 'Confirmation code is expired',
            field: 'code',
          },
        ],
      };

      return res.status(400).send(message);
    }
  }

  return next();
};
