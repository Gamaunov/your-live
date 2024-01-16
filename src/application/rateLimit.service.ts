import { inject, injectable } from 'inversify';
import { ObjectId } from 'mongodb';

import { RateLimitsRepository } from '../infrastructure/rateLimits.repository';
import { RateLimitDBModel } from '../models/db/RateLimitDBModel';

@injectable()
export class RateLimitsService {
  constructor(
    @inject(RateLimitsRepository)
    protected rateLimitsRepository: RateLimitsRepository,
  ) {}
  async findRateLimit(
    ip: string,
    endpoint: string,
  ): Promise<RateLimitDBModel | null> {
    return this.rateLimitsRepository.findRateLimit(ip, endpoint);
  }

  async createNewRateLimit(
    ip: string,
    endpoint: string,
  ): Promise<RateLimitDBModel> {
    const newRateLimit = new RateLimitDBModel(
      new ObjectId(),
      ip,
      endpoint,
      Date.now(),
      Date.now(),
      1,
    );

    return this.rateLimitsRepository.createRateLimit(newRateLimit);
  }

  async updateCounter(
    ip: string,
    endpoint: string,
    currentDate: number,
  ): Promise<boolean> {
    const rateLimit: RateLimitDBModel | null =
      await this.rateLimitsRepository.findRateLimit(ip, endpoint);
    if (!rateLimit) return false;

    const attemptsCount: number = rateLimit.attemptsCount + 1;

    return this.rateLimitsRepository.updateCounter(
      ip,
      endpoint,
      attemptsCount,
      currentDate,
    );
  }

  async deleteRateLimit(ip: string, endpoint: string): Promise<boolean> {
    return this.rateLimitsRepository.deleteRateLimit(ip, endpoint);
  }

  async deleteAllRateLimits(): Promise<boolean> {
    return this.rateLimitsRepository.deleteAllRateLimits();
  }
}
