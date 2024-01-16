import { body } from 'express-validator';

import { UsersService } from '../../application/users.service';
import { container } from '../../composition-root';
import { UserModel } from '../../models/user/UserModel';

const usersService = container.resolve(UsersService);
const uniqueLoginOrEmail = async (loginOrEmail: string) => {
  const foundLoginOrEmail: UserModel | null =
    await usersService.findUserByLoginOrEmail(loginOrEmail);

  if (foundLoginOrEmail) {
    return Promise.reject(`Invalid ${loginOrEmail}`);
  }
  return;
};

export const userValidation = [
  body('login')
    .notEmpty()
    .isString()
    .trim()
    .isLength({ min: 3, max: 10 })
    .matches(/^[a-zA-Z0-9_-]*$/)
    .custom(async (login: string): Promise<void> => {
      await uniqueLoginOrEmail(login);
    })
    .withMessage('Invalid login'),

  body('password')
    .notEmpty()
    .isString()
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Invalid credentials'),

  body('email')
    .notEmpty()
    .isString()
    .trim()
    .isLength({ min: 1, max: 200 })
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .custom(async (email: string): Promise<void> => {
      await uniqueLoginOrEmail(email);
    })
    .withMessage('Invalid email'),
];
