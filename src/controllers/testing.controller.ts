import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { RateLimitsService } from '../application/rateLimit.service';
import { SecurityDevicesService } from '../application/securityDevices.service';
import { UsersService } from '../application/users.service';

@injectable()
export class TestingController {
  constructor(
    @inject(UsersService) protected usersService: UsersService,
    @inject(RateLimitsService)
    protected rateLimitsService: RateLimitsService,
    @inject(SecurityDevicesService)
    protected securityDevicesService: SecurityDevicesService,
  ) {}

  async clearDatabase(req: Request, res: Response) {
    await this.usersService.deleteAllUsers();
    await this.rateLimitsService.deleteAllRateLimits();
    await this.securityDevicesService.deleteAllDevices();

    res.sendStatus(204);
  }
}
