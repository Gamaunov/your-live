import { DeviceDBModel } from '../../../models/device/DeviceDBModel';
import { DeviceViewModel } from '../../../models/device/DeviceViewModel';

export const securityDevicesMapper = (
  device: DeviceDBModel,
): DeviceViewModel => {
  return {
    ip: device.ip,
    title: device.title,
    lastActiveDate: new Date(device.lastActiveDate * 1000).toISOString(),
    deviceId: device.deviceId,
  };
};
