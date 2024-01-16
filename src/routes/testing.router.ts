import { Router } from 'express';

import { container } from '../composition-root';
import { TestingController } from '../controllers/testing.controller';

export const testingRouter = Router({});
const testingController = container.resolve(TestingController);

/**
 * @swagger
 * /testing/all-data:
 *   delete:
 *     tags:
 *       - Testing
 *     summary: Clear the database by deleting all data from all tables/collections
 *     responses:
 *       '204':
 *         description: All data has been deleted
 */
testingRouter.delete(
  '/all-data',
  testingController.clearDatabase.bind(testingController),
);
