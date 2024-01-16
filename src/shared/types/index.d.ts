import { ObjectId } from 'mongodb';

import { UserDBModel } from '../../models';

declare global {
  namespace Express {
    export interface Request {
      user: UserDBModel | null;
      userId: ObjectId;
    }
  }
}
