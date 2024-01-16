import { Router } from 'express';

import { container } from '../composition-root';
import { AuthController } from '../controllers/auth.controller';
import { rateLimitMiddleware } from '../middlewares/auth/rateLimitMiddleware';
import { recoveryInputValidation } from '../middlewares/auth/recoveryInputValidation';
import { authBearerMiddleware } from '../middlewares/auth/authBearerMiddleware';
import { authValidation } from '../middlewares/auth/authValidationMiddleware';
import { errorsValidation } from '../middlewares/common/errorsValidation';
import { userValidation } from '../middlewares/users/userValidationMiddleware';
import { checkEmailCode } from '../middlewares/auth/checkEmailCode';
import { emailValidation } from '../middlewares/auth/emailValidationMiddleware';
import { checkEmail } from '../middlewares/users/checkEmail';
import { checkRefreshToken } from '../middlewares/auth/checkRefreshToken';

export const authRouter = Router({});
const authController = container.resolve(AuthController);

/**
 * @swagger
 * auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get information about the current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   description: "string"
 *                 login:
 *                   type: string
 *                   description: "string"
 *                 userId:
 *                   type: string
 *                   description: "string"
 *
 *       '401':
 *         description: Unauthorized
 */
authRouter.get(
  '/me',
  authBearerMiddleware,
  authController.getAccountInfo.bind(authController),
);

/**
 * @swagger
 * auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Try to log in a user to the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               loginOrEmail:
 *                 type: string
 *                 description: The login or email of the user
 *               password:
 *                 type: string
 *                 description: The password of the user
 *     responses:
 *       '200':
 *         description: Returns JWT accessToken (expires after 10 seconds) in the body and JWT refreshToken in a cookie (http-only, secure) (expires after 20 seconds).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT accessToken
 *       '400':
 *         description: If the inputModel has incorrect values
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorsMessages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         description: Error message
 *                       field:
 *                         type: string
 *                         description: Field associated with the error
 *       '401':
 *         description: If the password or login is incorrect
 *       '429':
 *         description: More than 5 attempts from one IP-address during 10 seconds
 */
authRouter.post(
  '/login',
  rateLimitMiddleware,
  authValidation,
  errorsValidation,
  authController.login.bind(authController),
);

/**
 * @swagger
 * auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: In cookie client must send correct refreshToken that will be revoked
 *     responses:
 *       '204':
 *         description: No Content
 *       '401':
 *         description: If the JWT refreshToken inside cookie is missing, expired or incorrect
 */
authRouter.post('/logout', authController.logout.bind(authController));

/**
 * @swagger
 * auth/registration:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Registration in the system. Email with confirmation code will be send to passed email address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 description: The login or email of the user
 *               password:
 *                 type: string
 *                 description: The password of the user
 *               email:
 *                 type: string
 *                 description: The password of the user
 *     responses:
 *       '204':
 *         description: Input data is accepted. Email with confirmation code will be send to passed email address
 *       '400':
 *         description: If the inputModel has incorrect values (in particular if the user with the given email or password already exists)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorsMessages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         description: Error message
 *                       field:
 *                         type: string
 *                         description: Field associated with the error
 *       '429':
 *         description: More than 5 attempts from one IP-address during 10 seconds
 */
authRouter.post(
  '/registration',
  rateLimitMiddleware,
  userValidation,
  errorsValidation,
  authController.registerUser.bind(authController),
);

/**
 * @swagger
 * auth/registration-confirmation:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Confirm registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: The login or email of the user
 *     responses:
 *       '204':
 *         description: Email was verified. Account was activated
 *       '400':
 *         description: If the confirmation code is incorrect, expired or already been applied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorsMessages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         description: Error message
 *                       field:
 *                         type: string
 *                         description: Field associated with the error
 *       '429':
 *         description: More than 5 attempts from one IP-address during 10 seconds
 */
authRouter.post(
  '/registration-confirmation',
  rateLimitMiddleware,
  checkEmailCode,
  authController.confirmRegistration.bind(authController),
);

/**
 * @swagger
 * auth/registration-email-resending:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Resend confirmation registration Email if user exists
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The login or email of the user
 *     responses:
 *       '204':
 *         description: 'Input data is accepted.Email with confirmation code will be send to passed email address.Confirmation code should be inside link as query param, for example: https://some-front.com/confirm-registration?code=youtcodehere'
 *       '400':
 *         description: If the inputModel has incorrect values
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorsMessages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         description: Error message
 *                       field:
 *                         type: string
 *                         description: Field associated with the error
 *       '429':
 *         description: More than 5 attempts from one IP-address during 10 seconds
 */
authRouter.post(
  '/registration-email-resending',
  rateLimitMiddleware,
  emailValidation,
  errorsValidation,
  checkEmail,
  authController.emailResending.bind(authController),
);

/**
 * @swagger
 * auth/password-recovery:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Password recovery via Email confirmation. Email should be sent with RecoveryCode inside
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The login or email of the user
 *     responses:
 *       '204':
 *         description: Even if current email is not registered (for prevent user's email detection)
 *       '400':
 *         description: 'If the inputModel has invalid email (for example 222^gmail.com)'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorsMessages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         description: Error message
 *                       field:
 *                         type: string
 *                         description: Field associated with the error
 *       '429':
 *         description: More than 5 attempts from one IP-address during 10 seconds
 */
authRouter.post(
  '/password-recovery',
  rateLimitMiddleware,
  emailValidation,
  errorsValidation,
  authController.passwordRecovery.bind(authController),
);

/**
 * @swagger
 * auth/new-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Confirm Password recovery
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: The login or email of the user
 *               recoveryCode:
 *                 type: string
 *                 description: The login or email of the user
 *     responses:
 *       '204':
 *         description: If code is valid and new password is accepted
 *       '400':
 *         description: 'If the inputModel has incorrect value (for incorrect password length) or RecoveryCode is incorrect or expired'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorsMessages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         description: Error message
 *                       field:
 *                         type: string
 *                         description: Field associated with the error
 *       '429':
 *         description: More than 5 attempts from one IP-address during 10 seconds
 */
authRouter.post(
  '/new-password',
  rateLimitMiddleware,
  recoveryInputValidation,
  errorsValidation,
  authController.changePassword.bind(authController),
);

/**
 * @swagger
 * auth/refresh-token:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Generate new pair of access and refresh tokens (in cookie client must send correct refreshToken that will be revoked after refreshing) Device LastActiveDate should be overrode by issued Date of new refresh token
 *     responses:
 *       '200':
 *         description: Returns JWT accessToken (expired after 10 seconds) in body and JWT refreshToken in cookie (http-only, secure) (expired after 20 seconds).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT accessToken
 *       '401':
 *         description: If the JWT refreshToken inside cookie is missing, expired or incorrect
 */
authRouter.post(
  '/refresh-token',
  checkRefreshToken,
  authController.refreshTokens.bind(authController),
);
