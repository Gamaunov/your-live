import { injectable } from 'inversify';

import { DeviceViewModel } from '../../models/device/DeviceViewModel';
import { SecurityDeviceMongooseModel } from '../../domain/entities/securityDevice.schema';
import { securityDevicesMapper } from '../../shared/mappers/devices/devices-mapper';

@injectable()
export class SecurityDevicesQueryRepository {
  async getSessions(userId: string): Promise<DeviceViewModel[]> {
    const foundDevices = await SecurityDeviceMongooseModel.find({ userId });
    return foundDevices.map((d) => securityDevicesMapper(d));
  }
}
