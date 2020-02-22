import { Component, OnInit, HostBinding, Inject } from '@angular/core';

import { AppSettingsService } from '@services/app-settings/app-settings.service';
import { UserService } from '@services/user/user.service';
import { ApiService } from '@services/api/api.service';
import { UtilService } from '@services/util/util.service';

import { Widgets, BIG_WIDGET_HEIGHT } from '@dashboard/utils/db-widgets.enum';
import { Fault } from '@dashboard/models/db-fault.model';
import { BrandNames } from '@enums/brand.enum';
import { EventsService } from '@services/events/events.service';

@Component({
  selector: 'db-faults',
  templateUrl: './db-faults.component.html',
  styleUrls: ['./db-faults.component.css']
})
export class DbFaultsComponent implements OnInit {
  @HostBinding('class.item')
  @HostBinding('id')
  private elementId = Widgets.FAULTS;
  @HostBinding('style.height.px')
  private elementHeight = BIG_WIDGET_HEIGHT;

  _refData: any;
  totalFaults: number;
  faults: Array<Fault> = [];
  faultyVehicleIds: Array<any> = [];
  totalFaultyVechicles: number;
  noData = false;

  dataLoaded = false;

  brands = BrandNames;

  constructor(
    @Inject('window') private window: Window,
    private appSettingsService: AppSettingsService,
    private eventsService: EventsService,
    private apiService: ApiService,
    public userService: UserService,
    private utilService: UtilService
  ) {}

  ngOnInit() {
    this.apiService.getFaultsData().subscribe(
      data => {
        this._refData = data;
        this.setFaultsData(this._refData);

        this.dataLoaded = true;
      },
      error => console.log(error)
    );
  }

  setFaultsData(_refData) {
    if (_refData.length > 0) {
      this.setupFaultDetails(_refData);

      this.totalFaults = this.faults.length;

      this.getFaultyVehicleIds(this.faults);

      this.totalFaultyVechicles = this.faultyVehicleIds.length;
    } else {
      this.totalFaults = 0;
      this.totalFaultyVechicles = 0;
      this.noData = true;
    }
  }

  setupFaultDetails(content: Array<any>): void {
    for (let i = 0; i < content.length; i++) {
      const item = content[i];
      {
        const fault: Fault = {
          id: item.id,
          faultName: item.title,
          companyName: item['assetDetail']['brand'],
          vehicleName: item['assetDetail']['name'],
          vehicleId: item['assetDetail']['id'],
          faultTime: this.utilService.convertDate(item['created']),
          model: item['assetDetail']['model']
        };

        this.faults.push(fault);
      }
    }
  }

  private getFaultyVehicleIds(data: Array<any>) {
    data.forEach(fault => {
      const id = fault['vehicleName'];
      if (!this.faultyVehicleIds.includes(id)) {
        this.faultyVehicleIds.push(id);
      }
    });
  }

  goToFleet() {
    this.window.open(
      `${this.appSettingsService.appSettings.fleetRedirect}faults/overview`,
      '_self'
    );
  }

  removeWidget() {
    this.eventsService.removeWidget(Widgets.FAULTS);
  }
}
