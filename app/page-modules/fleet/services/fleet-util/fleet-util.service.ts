import { Injectable } from '@angular/core';
import { BrandNames } from '@enums/brand.enum';

@Injectable({
  providedIn: 'root'
})
export class FleetUtilService {
  constructor() {}

  checkStatus(status) {
    switch (status) {
      case 'KEYON':
        return '#e7a603';
      case 'OFF':
        return 'grey';
      case 'WORKING':
        return '#25b03d';
      case 'MOVING':
        return '#01a8b4';
      case 'IDLE':
        return '#f47825';
      case 'TRAVELING':
        return '#035db1';
      default:
        return 'black';
    }
  }

  isDeviceTypeCFV(capabilities) {
    if (
      capabilities &&
      capabilities.deviceType &&
      capabilities.deviceType.toLowerCase() === 'cfv'
    ) {
      return true;
    }
    return false;
  }

  getDisconnectedVehicleImageURL(brand, type, modelIcon) {
    const _vType = type.name.toLowerCase();

    if (brand === BrandNames.CIH) {
      const _assetOffsetPath = 'assets/climate-disconnected/case';
      if (_vType.includes('tractor')) {
        if (modelIcon && modelIcon.toLowerCase().includes('4wd')) {
          return `${_assetOffsetPath}/tractor-4-wd.svg`;
        } else if (modelIcon && modelIcon.toLowerCase().includes('cch')) {
          return `${_assetOffsetPath}/tractor-cch.svg`;
        }
        return `${_assetOffsetPath}/tractor-ccm.svg`;
      }
      if (_vType.includes('sprayer') || _vType.includes('floater')) {
        return `${_assetOffsetPath}/sprayer.svg`;
      }
      if (_vType.includes('windrower')) {
        return `${_assetOffsetPath}/windrower.svg`;
      }
      if (_vType.includes('sugar cane')) {
        return `${_assetOffsetPath}/sugarcane.svg`;
      }
      if (_vType.includes('combine')) {
        return `${_assetOffsetPath}/combine.svg`;
      }
    }

    if (brand === BrandNames.NH) {
      const _assetOffsetPath = 'assets/climate-disconnected/new-holland';
      if (_vType.includes('combine')) {
        return `${_assetOffsetPath}/combine-flagship-disconnected@3x.png`;
      }
      if (_vType.includes('forage harvester')) {
        return `${_assetOffsetPath}/combine-forage-harvester-disconnected@3x.png`;
      }
      if (_vType.includes('sprayer') || _vType.includes('floater')) {
        return `${_assetOffsetPath}/sprayer-guardian-disconnected@3x.png`;
      }
      if (_vType.includes('tractor')) {
        if (modelIcon && modelIcon.toLowerCase().includes('4wd')) {
          return `${_assetOffsetPath}/tractor-4-wd-disconnected@3x.png`;
        } else if (modelIcon && modelIcon.toLowerCase().includes('cch')) {
          return `${_assetOffsetPath}/tractor-cch-disconnected@3x.png`;
        }
        return `${_assetOffsetPath}/tractor-ccm-disconnected@3x.png`;
      }
      if (_vType.includes('windrower')) {
        return `${_assetOffsetPath}/windrower-yellow-disconnected@3x.png`;
      }
    }
  }
}
