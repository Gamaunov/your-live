import { Router } from 'express';

import { container } from '../composition-root';
import { SecurityDevicesController } from '../controllers/securityDevices.controller';
import { checkForRefreshToken } from '../middlewares/auth/checkForRefreshToken';
import { deviceIdMiddleware } from '../middlewares/auth/deviceIdMiddleware';

export const securityDevicesRouter = Router({});
const securityDevicesController = container.resolve(SecurityDevicesController);

/**
 * @swagger
 * security/devices:
 *   get:
 *     tags:
 *       - SecurityDevices
 *     summary: Returns all devices with active sessions for the current user
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ip:
 *                     type: string
 *                   title:
 *                     type: string
 *                   lastActiveDate:
 *                     type: string
 *                   deviceId:
 *                     type: string
 *       '401':
 *         description: If the JWT refreshToken inside the cookie is missing, expired, or incorrect
 */
securityDevicesRouter.get(
  '/',
  checkForRefreshToken,
  securityDevicesController.getDevices.bind(securityDevicesController),
);

/**
 * @swagger
 * security/devices/{deviceId}:
 *   delete:
 *     tags:
 *       - SecurityDevices
 *     summary: Terminate the specified device session
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         description: The ID of the device session to terminate
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: No Content
 *       '401':
 *         description: If the JWT refreshToken inside the cookie is missing, expired, or incorrect
 *       '403':
 *         description: If trying to delete the deviceId of another user
 *       '404':
 *         description: Not Found
 */
securityDevicesRouter.delete(
  '/:deviceId',
  deviceIdMiddleware,
  securityDevicesController.deleteDevice.bind(securityDevicesController),
);

/**
 * @swagger
 * security/devices/:
 *   delete:
 *     tags:
 *       - SecurityDevices
 *     summary: Terminate all other (exclude current) device's sessions
 *     responses:
 *       '204':
 *         description: No Content
 *       '401':
 *         description: If the JWT refreshToken inside the cookie is missing, expired, or incorrect
 */
securityDevicesRouter.delete(
  '/',
  checkForRefreshToken,
  securityDevicesController.deleteDevices.bind(securityDevicesController),
);
