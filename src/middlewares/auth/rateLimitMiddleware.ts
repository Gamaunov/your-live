import { NextFunction, Request, Response } from 'express';

import { RateLimitsService } from '../../application/rateLimit.service';
import { container } from '../../composition-root';

const rateLimitsService = container.resolve(RateLimitsService);
export const rateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const foundRateLimit = await rateLimitsService.findRateLimit(
    req.ip!,
    req.originalUrl,
  );

  if (!foundRateLimit) {
    await rateLimitsService.createNewRateLimit(req.ip!, req.originalUrl);
  } else {
    const currentDate = Date.now();

    if (foundRateLimit.attemptsCount >= 5) {
      if (currentDate - foundRateLimit.lastAttempt < 5000) {
        res.sendStatus(429);
        return;
      } else {
        await rateLimitsService.deleteRateLimit(req.ip!, req.originalUrl);
      }
    }

    if (currentDate - foundRateLimit.firstAttempt < 10000) {
      await rateLimitsService.updateCounter(
        req.ip!,
        req.originalUrl,
        currentDate,
      );
    } else {
      await rateLimitsService.deleteRateLimit(req.ip!, req.originalUrl);
      await rateLimitsService.createNewRateLimit(req.ip!, req.originalUrl);
    }
  }

  next();
};
