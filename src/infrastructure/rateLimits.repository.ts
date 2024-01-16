import { injectable } from 'inversify';

import { RateLimitMongooseModel } from '../domain/entities/rateLimit.schema';
import { RateLimitDBModel } from '../models/db/RateLimitDBModel';

@injectable()
export class RateLimitsRepository {
  async findRateLimit(
    ip: string,
    endpoint: string,
  ): Promise<RateLimitDBModel | null> {
    return RateLimitMongooseModel.findOne({
      ip,
      endpoint,
    });
  }

  async createRateLimit(
    rateLimit: RateLimitDBModel,
  ): Promise<RateLimitDBModel> {
    await RateLimitMongooseModel.create(rateLimit);

    return rateLimit;
  }

  async updateCounter(
    ip: string,
    endpoint: string,
    attemptsCount: number,
    currentDate: number,
  ): Promise<boolean> {
    const result = await RateLimitMongooseModel.updateOne(
      { ip, endpoint },
      {
        $set: {
          attemptsCount,
          lastAttempt: currentDate,
        },
      },
    );
    return result.matchedCount === 1;
  }

  async deleteRateLimit(ip: string, endpoint: string): Promise<boolean> {
    const result = await RateLimitMongooseModel.deleteOne({ ip, endpoint });
    return result.deletedCount === 1;
  }

  async deleteAllRateLimits(): Promise<boolean> {
    await RateLimitMongooseModel.deleteMany({});
    return (await RateLimitMongooseModel.countDocuments()) === 0;
  }
}
