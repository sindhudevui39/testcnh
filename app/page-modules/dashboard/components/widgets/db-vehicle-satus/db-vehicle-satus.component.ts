import { Component, OnInit, HostBinding, ViewChild, Inject } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import 'chart.piecelabel.js';

import { ApiService } from '@services/api/api.service';
import { AppSettingsService } from '@services/app-settings/app-settings.service';
import { colors, options, StatusColors, Status } from '@services/constants';

import { Widgets, BIG_WIDGET_HEIGHT } from '@dashboard/utils/db-widgets.enum';
import { Vehicle } from '@dashboard/models/db-vehicle.model';
import { ListByStatus, statusList, VehicleStatusLabel } from './db-vehicle-status.properties';
import { EventsService } from '@services/events/events.service';

@Component({
  selector: 'db-vehicle-satus',
  templateUrl: './db-vehicle-satus.component.html',
  styleUrls: ['./db-vehicle-satus.component.css']
})
export class DbVehicleSatusComponent implements OnInit {
  @HostBinding('class.item')
  @HostBinding('id')
  private elementId = Widgets.VEHICLE_STATUS;
  @HostBinding('style.height.px')
  private height = BIG_WIDGET_HEIGHT;

  @ViewChild(BaseChartDirective)
  chart: BaseChartDirective;

  dataLoaded: Boolean = false;
  showNoVehicleMsg = false;

  chartColors: Array<any> = colors;
  chartOptions: any = options;
  vehicleData: any = {
    WORKING: 0,
    KEYON: 0,
    IDLE: 0,
    MOVING: 0,
    TRAVELLING: 0,
    OFF: 0
  };

  hoveredIndex: number;

  // Chart data
  chartLabels: Array<any> = [];
  chartData: Array<number> = [];

  dataList: Array<Vehicle> = [];
  allStatusVList: Array<ListByStatus> = [];
  vehicleList: Array<Vehicle> = [];

  currentStatus: string;
  currentStatusColor: string;
  highlightIndex: number;
  totalVehicles = 0;

  // Reference to vehicle data
  _refData: any;

  constructor(
    @Inject('window') private window: Window,
    private eventsService: EventsService,
    private apiService: ApiService,
    private appSettingsService: AppSettingsService
  ) {}

  ngOnInit() {
    this.apiService.getVehicleData().subscribe(
      data => {
        this._refData = data;
        if (this._refData.length > 0) {
          this.setupVehicleData(this._refData);

          const initialListData = this.allStatusVList.filter(content => content.data.length > 0)[0];
          if (initialListData) {
            this.vehicleList = initialListData.data;

            this.highlightIndex = statusList.indexOf(initialListData.status);

            this.currentStatus = initialListData.status;

            this.currentStatusColor = StatusColors[this.currentStatus];
          }
        }
        this.setupChartData();
        this.showNoVehicleMsg = this.totalVehicles === 0 ? true : false;

        this.dataLoaded = true;
      },
      error => console.log(error),
      () => {
        setTimeout(() => {
          const _seg = this.getChartSegment(this.highlightIndex);
          this.chartClicked(undefined, _seg);
        });
      }
    );
  }

  dataListFn(data, status): Array<Vehicle> {
    this.dataList = [];

    const vList = data;
    const vLength = data.length;

    for (let i = 0; i < vLength; i++) {
      if ((vList[i]['status'] && vList[i]['status']['name']) === status) {
        const vdata: Vehicle = {
          name: vList[i].name,
          model: vList[i].model,
          id: vList[i].id
        };
        this.dataList.push(vdata);
      }
    }

    this.vehicleData[status] = this.dataList.length;

    this.totalVehicles += this.dataList.length;

    return this.dataList;
  }

  setupVehicleData(data) {
    statusList.forEach(status => {
      const statusListItem: ListByStatus = {
        status: status,
        data: this.dataListFn(data, status)
      };
      this.allStatusVList.push(statusListItem);
    });
  }

  setupChartData(): void {
    for (const key in this.vehicleData) {
      if (key) {
        const label: VehicleStatusLabel = {
          label: Status[key],
          color: StatusColors[key],
          data: this.vehicleData[key],
          status: key
        };

        this.chartLabels.push(label);
        this.chartData.push(this.vehicleData[key]);
      }
    }
  }

  private getChartSegment(index: number = 0) {
    if (this.chart) {
      return this.chart.chart.getDatasetMeta(0).data[index];
    }
  }

  private hoverChartSegment(segment: any): void {
    if (this.hoveredIndex !== segment['_index']) {
      this.chart.chart.update();
      this.hoveredIndex = segment['_index'];
      segment._model.outerRadius += 5;
    }
  }

  chartClicked(e: any, _seg?: any): void {
    if (_seg) {
      this.hoverChartSegment(_seg);
    }

    if (e && e.active.length > 0) {
      const index = e.active[0]._index;
      const item = this.chartLabels[index];

      this.changeLabel(index, item);
    }
  }

  changeLabel(index: number, item: any): void {
    this.showNoVehicleMsg = item.data === 0 ? true : false;
    this.highlightIndex = index;
    this.currentStatus = item.status;
    this.filterData(this.currentStatus);
    this.currentStatusColor = item.color;

    const _seg = this.getChartSegment(index);

    this.hoverChartSegment(_seg);
  }

  filterData(status) {
    this.vehicleList = this.allStatusVList.filter(vData => vData.status === status)[0].data;
  }

  removeWidget() {
    this.eventsService.removeWidget(Widgets.VEHICLE_STATUS);
  }

  goToVehicleDetailPage(vehicle) {
    const id = vehicle.id;

    this.window.open(`${this.appSettingsService.appSettings.fleetRedirect}detail/${id}`, '_self');
  }
}
