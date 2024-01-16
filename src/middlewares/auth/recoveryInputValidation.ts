import { body } from 'express-validator';

export const recoveryInputValidation = [
  body('newPassword')
    .notEmpty()
    .isString()
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Invalid newPassword'),

  body('recoveryCode')
    .notEmpty()
    .isString()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Invalid recoveryCode'),
];
