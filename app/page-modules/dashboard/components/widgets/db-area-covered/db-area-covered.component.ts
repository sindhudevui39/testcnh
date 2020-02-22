import { Component, OnInit, HostBinding } from '@angular/core';

import { Widgets, BIG_WIDGET_HEIGHT } from '@dashboard/utils/db-widgets.enum';
import { Vehicle } from '@dashboard/models/db-vehicle.model';
import { ApiService } from '@services/api/api.service';
import { UtilService } from '@services/util/util.service';
import { EventsService } from '@services/events/events.service';

@Component({
  selector: 'db-area-covered',
  templateUrl: './db-area-covered.component.html',
  styleUrls: ['./db-area-covered.component.css']
})
export class DbAreaCoveredComponent implements OnInit {
  @HostBinding('class.item')
  @HostBinding('id')
  private elementId = Widgets.AREA_COVERED;
  @HostBinding('style.height.px')
  private elementHeight = BIG_WIDGET_HEIGHT;

  vehicleList: Array<Vehicle> = [];
  dataLoaded = false;
  noData: boolean;
  unit: string;

  constructor(
    private eventsService: EventsService,
    private apiService: ApiService,
    private utilService: UtilService
  ) {}

  ngOnInit() {
    this.apiService.getAreaCoveredData().subscribe(
      data => {
        this.unit = data['columns']['AREA_WORKED']['unit'];

        const vData = data['groups'];

        for (const i in vData) {
          if (i) {
            const vehicle: Vehicle = {
              name: vData[i].metadata.__vehicle.name,
              model: vData[i].metadata.__vehicle.model,
              value: vData[i].data.AREA_WORKED.value,
              time: this.utilService.convertDate(vData[i].data.AREA_WORKED.updated),
              id: vData[i].metadata.__vehicle.id
            };

            this.vehicleList.push(vehicle);
          }
        }
        this.dataLoaded = true;

        this.noData = this.vehicleList.length === 0 ? true : false;
      },
      err => {
        this.dataLoaded = true;
        this.noData = true;
      }
    );
  }

  removeWidget() {
    this.eventsService.removeWidget(Widgets.AREA_COVERED);
  }

  goToVehicleDetailPage(vehicle) {
    const id = vehicle.id;
    this.utilService.redirectToEvo('fleet', `detail/${id}`);
  }
}
