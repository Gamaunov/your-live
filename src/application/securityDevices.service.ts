import { inject, injectable } from 'inversify';
import { ObjectId } from 'mongodb';

import { SecurityDevicesRepository } from '../infrastructure/securityDevices.repository';
import { DeviceDBModel } from '../models/device/DeviceDBModel';
import { DeviceViewModel } from '../models/device/DeviceViewModel';
import { TokenPayload } from '../shared/types/auth/auth-types';
import { SecurityDeviceDBModel } from '../models/db/SecurityDeviceDBModel';

import { JwtService } from './jwt.service';

@injectable()
export class SecurityDevicesService {
  constructor(
    @inject(SecurityDevicesRepository)
    protected securityDevicesRepository: SecurityDevicesRepository,
    @inject(JwtService) protected jwtService: JwtService,
  ) {}
  async findDeviceById(deviceId: string): Promise<DeviceDBModel | null> {
    return this.securityDevicesRepository.findDeviceById(deviceId);
  }

  async createDevice(
    newRefreshToken: string,
    ip: string,
    userAgent: string,
  ): Promise<DeviceViewModel | null> {
    const verifiedToken: TokenPayload | null =
      await this.jwtService.verifyRefreshToken(newRefreshToken);

    if (!verifiedToken) return null;

    const newDevice: SecurityDeviceDBModel = new SecurityDeviceDBModel(
      new ObjectId(),
      ip,
      userAgent,
      verifiedToken.userId.toString(),
      verifiedToken.deviceId,
      verifiedToken.iat,
      verifiedToken.exp,
    );

    return this.securityDevicesRepository.createDevice(newDevice);
  }

  async updateDevice(
    ip: string,
    userId: string,
    issuedAt: number,
  ): Promise<boolean> {
    return this.securityDevicesRepository.updateDevice(ip, userId, issuedAt);
  }

  async terminateSession(deviceId: string): Promise<boolean> {
    return this.securityDevicesRepository.terminateSession(deviceId);
  }

  async removeOutdatedDevices(currentDevice: string): Promise<boolean> {
    return this.securityDevicesRepository.removeOutdatedDevices(currentDevice);
  }

  async deleteAllDevices(): Promise<boolean> {
    return this.securityDevicesRepository.deleteAllDevices();
  }
}
