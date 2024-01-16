import { body } from 'express-validator';

export const emailValidation = [
  body('email')
    .notEmpty()
    .isString()
    .trim()
    .isLength({ min: 1, max: 200 })
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage('Invalid email'),
];
