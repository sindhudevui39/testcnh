import { Component, OnInit, HostBinding } from '@angular/core';

import { Widgets, SMALL_WIDGET_HEIGHT } from '@dashboard/utils/db-widgets.enum';
import { ApiService } from '@services/api/api.service';
import { UtilService } from '@services/util/util.service';
import { EventsService } from '@services/events/events.service';

@Component({
  selector: 'db-total-fuel',
  templateUrl: './db-total-fuel.component.html',
  styleUrls: ['./db-total-fuel.component.css']
})
export class DbTotalFuelComponent implements OnInit {
  @HostBinding('class.item')
  @HostBinding('id')
  private elementId = Widgets.TOTAL_FUEL_CONSUMPTION;
  @HostBinding('style.height.px')
  private elementHeight = SMALL_WIDGET_HEIGHT;

  dataLoaded: Boolean = false;
  noData = true;
  fuelData: Array<any> = [];
  totalFuelConsumed: number;
  averageFuelRate: string;
  measurementUnit: string;

  totalFuelDay: Array<number>;
  sortedTotFuelDay: Array<number> = [];
  minScale = 7;

  maxRange: number;
  minRange: number;

  // colors of bars from darkest to lightest
  descendingColors = ['#ef6c00', '#f57c00', '#ff9800', '#ff9800', '#f9bc06', '#f3bc01', '#f9c516'];

  past7Days: string[] = [];

  constructor(
    private eventsService: EventsService,
    private apiService: ApiService,
    private util: UtilService
  ) {
    const localISOTime = [];

    for (let index = 0; index < 7; index++) {
      localISOTime.push(util.getCurrentISOTime(index));
    }

    this.past7Days = localISOTime.map(item => this.util.formatDate(new Date(item)));
  }

  ngOnInit() {
    this.apiService.getTotalFuelConsumptionData().subscribe(
      data => {
        const fuelRates = [];

        for (const key in data['groups']) {
          if (key) {
            const groupData = data['groups'][key];
            const totalFuel = groupData['data']['__FUEL_BURNED']['value'] as number;
            const duration = groupData['data']['__FUEL_BURNED']['duration'] as number;

            const vehicleData = {
              date: this.util.formatDate(new Date(key)),
              totalFuel: totalFuel.toFixed(2)
            };

            this.fuelData.push(vehicleData);

            const fuelRate = totalFuel / duration;
            fuelRates.push(fuelRate);
          }
        }

        this.totalFuelConsumed = this.fuelData
          .map(o => o.totalFuel)
          .reduce((a, b) => parseFloat(a) + parseFloat(b))
          .toFixed(2);

        this.averageFuelRate = (
          parseFloat(fuelRates.reduce((a, b) => a + b)) / this.fuelData.length
        ).toFixed(2);

        const fuelDates = this.fuelData.map(item => item.date);

        const emptyDates = this.past7Days
          .filter(item => fuelDates.indexOf(item) === -1)
          .map(date => {
            return {
              date,
              totalFuel: 0
            };
          });

        this.fuelData = [...this.fuelData, ...emptyDates].sort(
          (a, b) => +new Date(b.date) - +new Date(a.date)
        );

        this.measurementUnit = data['columns']['__FUEL_BURNED']['muCode'];

        this.totalFuelDay = this.fuelData.map(o => {
          return o.totalFuel;
        });

        this.maxRange = Math.max.apply(Math, this.totalFuelDay);
        this.minRange = Math.min.apply(Math, this.totalFuelDay);

        this.calculate();
        this.sort_unique(this.totalFuelDay);
        this.assignColors();

        this.dataLoaded = true;
        this.noData = false;
      },
      err => {
        this.dataLoaded = true;
        this.noData = true;
      }
    );
  }

  private sort_unique(arr): void {
    this.sortedTotFuelDay = arr
      .sort((a, b) => b - a)
      .filter(val => !(this.sortedTotFuelDay.indexOf(val) > 0));
  }

  private calculate() {
    for (let i = 0; i < this.totalFuelDay.length; i++) {
      const unscaled = this.totalFuelDay[i];

      const scaled = this.util.scaleBetween(
        unscaled,
        this.minScale,
        22,
        this.minRange,
        this.maxRange
      );

      this.fuelData[i]['width'] = scaled.toFixed(0);
      this.fuelData[i]['outerwidth'] = (scaled + 2).toFixed(0);
    }
  }

  private assignColors() {
    for (let i = 0; i < this.fuelData.length; i++) {
      if (this.fuelData[i].totalFuel === 0) {
        this.fuelData[i]['color'] = '#c7c0b9';
      } else {
        this.fuelData[i]['color'] = this.descendingColors[
          this.sortedTotFuelDay.indexOf(this.fuelData[i].totalFuel)
        ];
      }
    }
  }

  removeWidget() {
    this.eventsService.removeWidget(Widgets.TOTAL_FUEL_CONSUMPTION);
  }
}
