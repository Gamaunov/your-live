import { Container } from 'inversify';
import 'reflect-metadata';

import { AuthService } from './application/auth.service';
import { JwtService } from './application/jwt.service';
import { RateLimitsService } from './application/rateLimit.service';
import { SecurityDevicesService } from './application/securityDevices.service';
import { UsersService } from './application/users.service';
import { AuthController } from './controllers/auth.controller';
import { SecurityDevicesController } from './controllers/securityDevices.controller';
import { TestingController } from './controllers/testing.controller';
import { UsersController } from './controllers/users.controller';
import { SecurityDevicesQueryRepository } from './infrastructure/query/securityDevices.query.repository';
import { UsersQueryRepository } from './infrastructure/query/users.query.repository';
import { RateLimitsRepository } from './infrastructure/rateLimits.repository';
import { SecurityDevicesRepository } from './infrastructure/securityDevices.repository';
import { UsersRepository } from './infrastructure/users.repository';
import { VideosController } from './controllers/videos.controller';
import { VideosRepository } from './infrastructure/videos.repository';
import { VideosQueryRepository } from './infrastructure/query/videos.query.repository';

export const container = new Container();

container.bind(VideosController).to(VideosController);
container.bind(UsersController).to(UsersController);
container.bind(AuthController).to(AuthController);
container.bind(SecurityDevicesController).to(SecurityDevicesController);
container.bind(TestingController).to(TestingController);

container.bind(UsersService).to(UsersService);
container.bind(AuthService).to(AuthService);
container.bind(JwtService).to(JwtService);
container.bind(SecurityDevicesService).to(SecurityDevicesService);
container.bind(RateLimitsService).to(RateLimitsService);

container.bind(VideosRepository).to(VideosRepository);
container.bind(UsersRepository).to(UsersRepository);
container.bind(SecurityDevicesRepository).to(SecurityDevicesRepository);
container.bind(RateLimitsRepository).to(RateLimitsRepository);

container.bind(VideosQueryRepository).to(VideosQueryRepository);
container.bind(UsersQueryRepository).to(UsersQueryRepository);
container
  .bind(SecurityDevicesQueryRepository)
  .to(SecurityDevicesQueryRepository);
