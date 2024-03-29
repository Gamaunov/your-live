import mongoose from 'mongoose';

import { RateLimitDBModel } from '../../models/db/RateLimitDBModel';

const rateLimitSchema = new mongoose.Schema<RateLimitDBModel>({
  ip: { type: String, required: true },
  endpoint: { type: String, required: true },
  firstAttempt: { type: Number, required: true },
  lastAttempt: { type: Number, required: true },
  attemptsCount: { type: Number, required: true },
});

export const RateLimitMongooseModel = mongoose.model(
  'rateLimits',
  rateLimitSchema,
);
