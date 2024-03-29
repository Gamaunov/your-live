import { ObjectId } from 'mongodb';

export class SecurityDeviceDBModel {
  constructor(
    public _id: ObjectId,
    public ip: string,
    public title: string,
    public userId: string,
    public deviceId: string,
    public lastActiveDate: number,
    public expirationDate: number,
  ) {}
}
