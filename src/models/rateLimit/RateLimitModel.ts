export type RateLimitModel = {
  ip: string;
  endpoint: string;
  firstAttempt: number;
  lastAttempt: number;
  attemptsCount: number;
};
