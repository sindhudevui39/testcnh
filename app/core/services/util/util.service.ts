import { Injectable, Inject } from '@angular/core';
import { DatePipe } from '@angular/common';

import { Urls } from '@enums/urls.enum';
import { BrandNames } from '@enums/brand.enum';

import { AppSettingsService } from '@services/app-settings/app-settings.service';
import { UserService } from '@services/user/user.service';

const deprecatedUSTZList = ['ALASKA', 'ARIZONA', 'CENTRAL', 'EASTERN', 'HAWAII', 'MOUNTAIN'];

enum LinkedUSTZ {
  ALASKA = 'America/Anchorage',
  ARIZONA = 'America/Phoenix',
  CENTRAL = 'America/Chicago',
  EASTERN = 'America/New_York',
  HAWAII = 'Pacific/Honolulu',
  MOUNTAIN = 'America/Denver'
}
@Injectable({
  providedIn: 'root'
})
export class UtilService {
  constructor(
    @Inject('window') private window: Window,
    private appSettingsService: AppSettingsService,
    private userService: UserService
  ) {}

  getQueryParam(key: string): string {
    return this.getUrlParameter(key);
  }

  getUrlParameter(key) {
    key = key.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');

    const regex = new RegExp('[\\?&]' + key + '=([^&#]*)');
    const results = regex.exec(this.window.location.search);

    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  getImageByName(name) {
    const image_url = 'assets/customparameters-images/';

    switch (this.userService.getBrand()) {
      case BrandNames.CIH:
        if (name.toLowerCase().includes('floater') || name.toLowerCase().includes('sprayer')) {
          return `${image_url}cih/cih-Sprayer & Floater.png`;
        }
        return `${image_url}cih/cih-${name}.png`;
      case BrandNames.NH:
        if (name.toLowerCase().includes('floater') || name.toLowerCase().includes('sprayer')) {
          return `${image_url}n-h/nh-Sprayer & Floater.png`;
        }
        return `${image_url}n-h/nh-${name}.png`;
      default:
        break;
    }
  }
  getImageUrl(unit) {
    const vehicleUrl = Urls.VEHICLE_ICON;
    const vType = unit.type.name.toLowerCase();

    if (unit.brand === BrandNames.CIH) {
      if (vType.includes('tractor')) {
        if (unit.modelIcon && unit.modelIcon.toLowerCase().includes('4wd')) {
          return `${vehicleUrl}-Cih/icon-vehicle-cih-tractor-4wd-medium.png`;
        } else if (unit.modelIcon && unit.modelIcon.toLowerCase().includes('cch')) {
          return `${vehicleUrl}-Cih/icon-vehicle-cih-tractor-cch-medium.png`;
        }
        return `${vehicleUrl}-Cih/icon-vehicle-cih-tractor-ccm-medium.png`;
      }
      if (vType.includes('sprayer') || vType.includes('floater')) {
        return `${vehicleUrl}-Cih/icon-vehicle-cih-sprayer-medium.png`;
      }
      if (vType.includes('windrower')) {
        return `${vehicleUrl}-Cih/icon-vehicle-cih-windrowers-medium.png`;
      }
      if (vType.includes('sugar cane')) {
        return `${vehicleUrl}-Cih/icon-vehicle-cih-sugarcan-medium.png`;
      }
      if (vType.includes('combine')) {
        return `${vehicleUrl}-Cih/icon-vehicle-cih-combine-medium.png`;
      }
      return `${vehicleUrl}-Cih/icon-vehicle-cih-${vType}-medium.png`;
    }

    if (unit.brand === BrandNames.NH) {
      if (vType.includes('combine')) {
        return `${vehicleUrl}-Nh/icon-vehicle-nh-combine-flagship-medium.png`;
      }
      if (vType.includes('forage harvester')) {
        return `${vehicleUrl}-Nh/icon-vehicle-nh-forageharvester-medium.png`;
      }
      if (vType.includes('sprayer') || vType.includes('floater')) {
        return `${vehicleUrl}-Nh/icon-vehicle-nh-sprayer-guardian-medium.png`;
      }
      if (vType.includes('tractor')) {
        if (unit.modelIcon && unit.modelIcon.toLowerCase().includes('4wd')) {
          return `${vehicleUrl}-Nh/icon-vehicle-nh-tractor-4wd-medium.png`;
        } else if (unit.modelIcon && unit.modelIcon.toLowerCase().includes('cch')) {
          return `${vehicleUrl}-Nh/icon-vehicle-nh-tractor-cch-medium.png`;
        }
        return `${vehicleUrl}-Nh/icon-vehicle-nh-tractor-ccm-medium.png`;
      }
      if (vType.includes('windrower')) {
        return `${vehicleUrl}-Nh/icon-vehicle-nh-windrower-yellow-medium.png`;
      }

      return `${vehicleUrl}-Nh/icon-vehicle-nh-${vType}-ccm-medium.png`;
    }
  }

  scaleBetween(unscaledNum, minAllowed, maxAllowed, min, max) {
    return ((maxAllowed - minAllowed) * (unscaledNum - min)) / (max - min) + minAllowed;
  }

  convertDate(dateString): string {
    return new Date(dateString).toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  }

  getCurrentISOTime(day) {
    const tzoffset = new Date().getTimezoneOffset() * 60000;

    const date = new Date();
    date.setDate(date.getDate() - day);

    const localISOTime = new Date(new Date(date).getTime() - tzoffset).toISOString();

    return localISOTime;
  }

  formatDate(date: Date) {
    let displayMonth = (date.getMonth() + 1).toString();
    let displayDate = date.getDate().toString();

    if (displayMonth.length === 1) {
      displayMonth = '0' + displayMonth;
    }

    if (displayDate.length === 1) {
      displayDate = '0' + displayDate;
    }

    return displayMonth + '/' + displayDate + '/' + date.getFullYear();
  }

  redirectToEvo(app: string, trailingPath: string = '') {
    let url = '';

    // if (this.appSettingsService.appSettings.environment === 'PROD') {
    //   if (this.userService.getBrand() === BrandNames.CIH) {
    //     url = this.getRedirectUrl(app, 'myafsconnect.com/');
    //   } else {
    //     url = this.getRedirectUrl(app, 'myplmconnect.com/');
    //   }
    // } else {
    //   url = this.getRedirectUrl(app);
    // }
    url = this.getRedirectUrl(app);
    url += trailingPath;

    this.window.open(url, '_self');
  }

  getRedirectUrl(app: string, brandDomain: string = '') {
    let url = '';

    switch (app) {
      case 'farm':
        url = `${this.appSettingsService.appSettings.farmRedirect}${brandDomain}`;
        break;
      case 'fleet':
        url = `${this.appSettingsService.appSettings.fleetRedirect}${brandDomain}`;
        break;
      case 'data':
        url = `${this.appSettingsService.appSettings.dataRedirect}${brandDomain}`;
        break;
    }

    return url;
  }

  // Converts a string to TitleCase
  totitleCase(string) {
    string = string
      .toLowerCase()
      .split(' ')
      .map(function(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      });
    return string.join(' ');
  }

  /** Returns the offset Timezone in the format +/-mmhh(+0530) for the 2 preferred timezone formats
   *   (Ex: 'Asia/Kolkata', GMT+01:30) coming from UserProfile API */
  getTimezoneOffset() {
    let _userPreferredTZ: string = this.userService.user['preferredTimeZone'];
    let _tzOffsetValue: string;

    if (_userPreferredTZ.includes('GMT')) {
      const _tz = _userPreferredTZ.match(/[+-][0-9]{2}:[0-9]{2}\b/)[0];
      _tzOffsetValue = _tz.replace(':', '');
    }

    if (
      _userPreferredTZ.split('/').length === 2 &&
      _userPreferredTZ.split(',').length === 1 &&
      _userPreferredTZ.split(' ').length === 1
    ) {
      if (_userPreferredTZ.includes('US')) {
        const _zone = _userPreferredTZ.split('/')[1].toUpperCase();

        if (deprecatedUSTZList.includes(_zone)) {
          _userPreferredTZ = LinkedUSTZ[_zone];
        } else {
          _userPreferredTZ = undefined;
        }
      }

      _tzOffsetValue = this.getTzOffsetforContinentalTz(_userPreferredTZ);
    }

    return _tzOffsetValue;
  }

  getTzOffsetforContinentalTz(tz) {
    const _date = new Date();
    let _a: Array<any>;

    if (tz) {
      _a = _date.toLocaleString('ja', { timeZone: tz }).split(/[\/\s:]/);
    } else {
      _a = _date.toLocaleString().split(/[\/\s:]/);
    }
    _a[1]--;

    const _t1 = Date.UTC.apply(null, _a);
    const _t2 = new Date(_date).setMilliseconds(0);

    const _minutes = (_t2 - _t1) / 60 / 1000;

    let _offsetHours: number | string = Math.floor(Math.abs(_minutes) / 60);
    let _offsetMinutes: number | string = Math.abs(_minutes) % 60;

    // generate the format hhmm
    if (_offsetHours < 10) {
      _offsetHours = '0' + _offsetHours;
    } else {
      _offsetHours.toString();
    }
    if (_offsetMinutes !== 30) {
      _offsetMinutes = '00';
    } else {
      _offsetMinutes.toString();
    }

    // append +/-
    let _tzOffset = `${_offsetHours}${_offsetMinutes}`;
    if (_minutes > 0) {
      _tzOffset = '-' + _tzOffset;
    } else {
      _tzOffset = '+' + _tzOffset;
    }
    return _tzOffset;
  }

  getUserPreferredDateTimeFormatted() {
    const _dateTimeFormat = this.userService.getTimeFormat().toLowerCase();
    return _dateTimeFormat.replace(/mm/gi, 'MM');
  }
}
