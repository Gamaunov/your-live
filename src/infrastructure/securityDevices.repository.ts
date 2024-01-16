import { injectable } from 'inversify';
import { DeleteResult, UpdateResult } from 'mongodb';

import { SecurityDeviceMongooseModel } from '../domain/entities/securityDevice.schema';
import { DeviceDBModel } from '../models/device/DeviceDBModel';
import { DeviceViewModel } from '../models/device/DeviceViewModel';

@injectable()
export class SecurityDevicesRepository {
  async findDeviceById(deviceId: string): Promise<DeviceDBModel | null> {
    return SecurityDeviceMongooseModel.findOne({ deviceId });
  }

  async createDevice(device: DeviceDBModel): Promise<DeviceViewModel> {
    await SecurityDeviceMongooseModel.create(device);

    return {
      ip: device.ip,
      title: device.title,
      lastActiveDate: device.lastActiveDate.toString(),
      deviceId: device.deviceId,
    };
  }

  async updateDevice(
    ip: string,
    userId: string,
    issuedAt: number,
  ): Promise<boolean> {
    const result: UpdateResult = await SecurityDeviceMongooseModel.updateOne(
      { userId },
      {
        $set: {
          lastActiveDate: issuedAt,
          ip,
        },
      },
    );

    return result.matchedCount === 1;
  }

  async terminateSession(deviceId: string): Promise<boolean> {
    const result: DeleteResult = await SecurityDeviceMongooseModel.deleteOne({
      deviceId,
    });

    return result.deletedCount === 1;
  }

  async removeOutdatedDevices(currentDevice: string): Promise<boolean> {
    await SecurityDeviceMongooseModel.deleteMany({
      deviceId: { $ne: currentDevice },
    });

    return (await SecurityDeviceMongooseModel.countDocuments()) === 1;
  }

  async deleteAllDevices(): Promise<boolean> {
    await SecurityDeviceMongooseModel.deleteMany({});
    return (await SecurityDeviceMongooseModel.countDocuments()) === 0;
  }
}
