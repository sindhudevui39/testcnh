import { Component, OnInit, HostBinding } from '@angular/core';

import { Widgets, SMALL_WIDGET_HEIGHT } from '@dashboard/utils/db-widgets.enum';
import { ApiService } from '@services/api/api.service';
import { EventsService } from '@services/events/events.service';

@Component({
  selector: 'db-daily-fuel',
  templateUrl: './db-daily-fuel.component.html',
  styleUrls: ['./db-daily-fuel.component.css']
})
export class DbDailyFuelComponent implements OnInit {
  @HostBinding('class.item')
  @HostBinding('id')
  private elementId = Widgets.DAILY_FUEL_CONSUMPTION;
  @HostBinding('style.height.px')
  private elementHeight = SMALL_WIDGET_HEIGHT;

  vehicleList: Array<any> = [];
  totalFuel: string;
  measurementUnit: string;

  dataLoaded = false;
  noData = true;

  constructor(private eventsService: EventsService, private apiSerice: ApiService) {}

  ngOnInit() {
    this.apiSerice.getDailyFuelConsumptionData().subscribe(
      data => {
        for (const key in data['groups']) {
          if (data['groups'].hasOwnProperty(key)) {
            const element = data['groups'][key];

            const vehicle = {
              name: element['metadata']['vehicle']['name'],
              model: element['metadata']['vehicle']['model'],
              fuel: (element['data']['__FUEL_BURNED']['value'] as number).toFixed(2),
              lastUpdated: element['data']['__FUEL_BURNED']['updated']
            };

            this.vehicleList.push(vehicle);
          }
        }

        this.totalFuel = this.vehicleList
          .map(vehicle => parseFloat(vehicle.fuel))
          .reduce((previousValue, currentValue) => previousValue + currentValue)
          .toFixed(2);

        this.measurementUnit = data['columns']['__FUEL_BURNED']['muCode'];

        this.dataLoaded = true;
        this.noData = false;
      },
      err => {
        this.dataLoaded = true;
        this.noData = true;
      }
    );
  }

  removeWidget() {
    this.eventsService.removeWidget(Widgets.DAILY_FUEL_CONSUMPTION);
  }
}
