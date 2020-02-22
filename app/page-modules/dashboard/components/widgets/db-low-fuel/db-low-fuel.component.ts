import { Component, OnInit, HostBinding } from '@angular/core';

import { ApiService } from '@services/api/api.service';
import { UtilService } from '@services/util/util.service';

import { Widgets, SMALL_WIDGET_HEIGHT } from '@dashboard/utils/db-widgets.enum';
import { Vehicle } from '@dashboard/models/db-vehicle.model';
import { EventsService } from '@services/events/events.service';

@Component({
  selector: 'db-low-fuel',
  templateUrl: './db-low-fuel.component.html',
  styleUrls: ['./db-low-fuel.component.css']
})
export class DbLowFuelComponent implements OnInit {
  @HostBinding('class.item')
  @HostBinding('id')
  private elementId = Widgets.LOW_FUEL;
  @HostBinding('style.height.px')
  private elementHeight = SMALL_WIDGET_HEIGHT;

  vehicleList: Array<any> = [];
  dataLoaded = false;
  noData = false;

  constructor(
    private eventsService: EventsService,
    private apiService: ApiService,
    private utilService: UtilService
  ) {}

  ngOnInit() {
    this.getVehicleData();
  }

  private getVehicleData() {
    this.apiService.getVehicleData().subscribe(data => {
      const lfData: any = data;
      if (lfData) {
        lfData.forEach(vehicleInfo => {
          if (vehicleInfo.parameters) {
            vehicleInfo.parameters.forEach(vehicleAttrs => {
              if (vehicleAttrs.label === 'Fuel tank level' && vehicleAttrs.value <= 15) {
                const vehicle = this.getVehicle(vehicleInfo, vehicleAttrs);

                this.vehicleList.push(vehicle);
              }
            });
          }
        });
      }

      if (this.vehicleList.length === 0) {
        this.noData = true;
      }

      this.dataLoaded = true;
    });
  }

  private getVehicle(vehicleInfo, vehicleAttrs) {
    const vehicle: Vehicle = {
      name: vehicleInfo.name,
      model: vehicleInfo.model,
      value: vehicleAttrs.value,
      id: vehicleInfo.id
    };

    return vehicle;
  }

  removeWidget() {
    this.eventsService.removeWidget(Widgets.LOW_FUEL);
  }

  goToVehicleDetailPage(vehicle) {
    const id = vehicle.id;

    this.utilService.redirectToEvo('fleet', `detail/${id}`);
  }
}
