import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import * as moment from 'moment';

import { FleetDataService } from '@fleet/services/fleet-data.service';
import { FleetService } from '@fleet/services/fleet.service';
import { RemoteDisplayService } from '@remote-display/services/remote-display/remote-display.service';
import { AppSettingsService } from '@services/app-settings/app-settings.service';
import { UserService } from '@services/user/user.service';
import { UtilService } from '@services/util/util.service';

import { OverviewListvehicleData } from '../../overview.models';

@Component({
  selector: 'app-fleet-overview-list-item',
  templateUrl: './fleet-overview-list-item.component.html',
  styleUrls: ['./fleet-overview-list-item.component.css']
})
export class FleetOverviewListItemComponent implements OnInit {
  @Input() disableRemoteDisplay: boolean;
  @Input() displayRDVOption: boolean;
  @Input() highlightValue: string;
  @Input() item: OverviewListvehicleData;
  @Input() rdvStatusMsg: string;
  @Input() isLast: boolean;
  public currentDate: Date;
  public dateFormat: string;
  public tzOffset: string;
  public etimLink: string;

  constructor(
    private _appSettings: AppSettingsService,
    private _remoteDisplay: RemoteDisplayService,
    private fleetService: FleetService,
    private fleetdata: FleetDataService,
    private _userService: UserService,
    private _utilService: UtilService,
    private route: Router
  ) {}

  ngOnInit() {
    this.currentDate = new Date();
    this.tzOffset = this._utilService.getTimezoneOffset();
    this.dateFormat = this._utilService.getUserPreferredDateTimeFormatted();

    if (this._userService.getUser().isDealer && !this.item.isClimateVehicle) {
      this.etimLink = `${
        this._appSettings.appSettings.etimSmartView
      }&extraSsoName=PIN&extraSsoValue=${this.updateSerialNumber(this.item.serialNumber)}`;
    } else {
      this.etimLink = '';
    }
  }

  getDateorDateTime(dateTime) {
    return moment(dateTime).calendar(moment.utc(), {
      sameDay: 'hh:mm a',
      lastDay: 'MM/DD/YYYY',
      lastWeek: 'MM/DD/YYYY',
      sameElse: function() {
        return 'MM/DD/YYYY';
      }
    });
  }

  getTooltipText(tooltipType: string) {
    if (tooltipType === 'NAME') {
      return this.item.name;
    } else {
      return `${this.item.brand} ${this.item.model} | ${this.item.serialNumber}`;
    }
  }

  getTranslationString() {
    if (this.item.statusName.toLowerCase() === 'off') {
      return 'GLOBAL.VEHICLE.STATUS.ENGINE_OFF';
    }
    return `GLOBAL.VEHICLE.STATUS.${this.item.statusName}`;
  }

  getVehicleInfo(vehicle: any) {
    const data = { vehicleData: vehicle };
    this.fleetdata.storage = data;

    this.fleetService._clickedId.next(vehicle.id);

    this.route.navigate(['/fleet/detail/' + vehicle.id]);
  }

  openTeamViewerDialog(data) {
    this._remoteDisplay.launchTeamviewer(data.id, data.name);
  }

  private updateSerialNumber(serialNumber: string): string {
    return serialNumber.replace('*', '').trim();
  }
}
