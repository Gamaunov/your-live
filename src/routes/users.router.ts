import { Router } from 'express';

import { container } from '../composition-root';
import { UsersController } from '../controllers/users.controller';
import { checkBasicMiddleware } from '../middlewares/auth/checkBasicMiddleware';
import { userValidation } from '../middlewares/users/userValidationMiddleware';
import { errorsValidation } from '../middlewares/common/errorsValidation';
import { validateObjectId } from '../middlewares/common/objectIdMiddleware';

export const usersRouter = Router({});
const usersController = container.resolve(UsersController);

usersRouter.get(
  `/`,
  checkBasicMiddleware,
  usersController.getUsers.bind(usersController),
);

/**
 * @swagger
 * users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Add new user to the system
 *     security:
 *       - basicAuth: []
 *     responses:
 *       '201':
 *         description: Returns the newly created user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   login:
 *                     type: string
 *                   email:
 *                     type: string
 *                   createdAt:
 *                     type: string
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
 *         description: Unauthorized
 */
usersRouter.post(
  `/`,
  checkBasicMiddleware,
  userValidation,
  errorsValidation,
  usersController.createUser.bind(usersController),
);

/**
 * @swagger
 * users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete user specified by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User id
 *         schema:
 *           type: string
 *     security:
 *       - basicAuth: []
 *     responses:
 *       '204':
 *         description: No Content
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: If specified user is not exists
 */
usersRouter.delete(
  `/:id`,
  checkBasicMiddleware,
  validateObjectId,
  usersController.deleteUser.bind(usersController),
);

usersRouter.delete(
  `/`,
  checkBasicMiddleware,
  validateObjectId,
  usersController.deleteUsers.bind(usersController),
);
