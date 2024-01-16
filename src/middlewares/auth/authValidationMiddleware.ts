import { body } from 'express-validator';

export const authValidation = [
  body('loginOrEmail')
    .notEmpty()
    .isString()
    .trim()
    .custom((value) => {
      if (
        !value.match(/^[a-zA-Z0-9_-]*$/) &&
        !value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
      ) {
        throw new Error('Invalid loginOrEmail');
      }
      return true;
    }),

  body('password')
    .notEmpty()
    .isString()
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Invalid credentials'),
];
