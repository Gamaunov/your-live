import { NextFunction, Request, Response } from 'express';
import { ValidationError, validationResult } from 'express-validator';

export const errorsValidation = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorsMessages = errors
      .array({ onlyFirstError: true })
      .map((e) => errorsFormatter(e));

    const responseData = {
      errorsMessages: errorsMessages,
    };

    return res.status(400).json(responseData);
  }

  return next();
};

const errorsFormatter = (e: ValidationError) => {
  switch (e.type) {
    case 'field':
      return {
        message: e.msg,
        field: e.path,
      };
    default:
      return {
        message: e.msg,
        field: 'None',
      };
  }
};
