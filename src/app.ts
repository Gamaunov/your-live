import cookieParser from 'cookie-parser';
import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { authRouter } from './routes/auth.router';
import { homeRouter } from './routes/home.router';
import { securityDevicesRouter } from './routes/securityDevices.router';
import { testingRouter } from './routes/testing.router';
import { usersRouter } from './routes/users.router';
import { swaggerOptions } from './swagger';
import { videosRouter } from './routes/videos.router';
import { RouterPath } from './shared/enums/common/routerPath';

export const app = express();
app.set('trust proxy', true);

app.use(express.json());
app.use(cookieParser());

app.disable('x-powered-by');

app.use(RouterPath.home, homeRouter);
app.use(RouterPath.auth, authRouter);
app.use(RouterPath.users, usersRouter);
app.use(RouterPath.videos, videosRouter);
app.use(RouterPath.security_devices, securityDevicesRouter);
app.use(RouterPath.testing, testingRouter);

if (process.env.NODE_ENV === 'development') {
  const specs = swaggerJSDoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}
