import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Chart, ChartDataSets } from 'chart.js';

import { FleetApiService } from '@fleet/services/fleet-api/fleet-api.service';
import { FleetFuelReportService } from '../../services/fleet-fuel-report/fleet-fuel-report.service';
import { UserService } from '@services/user/user.service';

import { getTwoDigit, getReportRequest } from '../../fleet-detail-util';
import { BrandNames } from '@enums/brand.enum';

@Component({
  selector: 'app-fleet-fuel-report',
  templateUrl: './fleet-fuel-report.component.html',
  styleUrls: ['./fleet-fuel-report.component.css']
})
export class FleetFuelReportComponent implements OnInit {
  private _vehicleId: string;
  private _lastUpdate: string;
  private _componentLoaded: boolean;

  @ViewChild('fuelChart')
  public fuelChart: ElementRef;
  public canvasContext: CanvasRenderingContext2D;
  public chartCanvas: Chart;
  public loaded = false;
  public averageFuel = 0;
  public totalFuel = 0;
  public maxFuel = 0;
  public minFuel = 0;
  public selectedOption = 'total';
  public fuelBurnedUom: string;
  public fuelRateUom: string;
  public panelClass: string;

  constructor(
    private _userService: UserService,
    private _fleetApi: FleetApiService,
    private _fuelReport: FleetFuelReportService
  ) {}

  @Input()
  public set vehicleId(id: string) {
    this._vehicleId = id;
  }

  @Input()
  public set lastUpdate(date: string) {
    this.init();

    if (!this._componentLoaded) {
      this.canvasContext = (<HTMLCanvasElement>this.fuelChart.nativeElement).getContext('2d');
      this.chartCanvas = new Chart(this.canvasContext, this._fuelReport.chartConfiguration);

      this._componentLoaded = true;
    }

    if (date) {
      this.loaded = false;
      this._lastUpdate = date;

      this.getFuelReport();
    } else {
      this.fuelBurnedUom = '';
      this.updateCanvas([], []);

      this.loaded = true;
    }
  }

  ngOnInit() {
    if (this._userService.getBrand() === BrandNames.NH) {
      this.panelClass = 'fleet-detail-select nh';
    } else {
      this.panelClass = 'fleet-detail-select cih';
    }
  }

  private init(): void {
    this._fuelReport.init();

    this.averageFuel = 0;
    this.totalFuel = 0;
    this.maxFuel = 0;
    this.minFuel = 0;
    this.fuelBurnedUom = '';
    this.fuelRateUom = '';
  }

  public updateChart() {
    if (!this._fuelReport.isChartDataAvailable) {
      return;
    }

    this.chartCanvas.config.data.datasets = this._fuelReport.getChartDataSets(this.selectedOption);
    this.chartCanvas.update();
  }

  private getFuelReport(): void {
    this._fleetApi.getFuelReports(getReportRequest(this._vehicleId, this._lastUpdate)).subscribe(
      data => {
        const hours = data['summary']['elapsed'] / 3600;
        const fuelBurnedUom = data['families']['burned']['userMuUnitCode'];

        this.fuelBurnedUom = fuelBurnedUom;
        this.fuelRateUom = data['families']['rate']['userMuUnitCode'];
        this.totalFuel = getTwoDigit(data['summary']['burned']);
        this.averageFuel = getTwoDigit(this.totalFuel / hours);

        const chartLabels = this._fuelReport.getChartLabels(data['end']);

        if (data['buckets']) {
          this._fuelReport.isChartDataAvailable = true;
          this._fuelReport.setupFuelDataSets(data, chartLabels);

          this.updateMinMaxFuel();
        }

        this.updateCanvas(chartLabels, this._fuelReport.getChartDataSets(this.selectedOption));

        this.loaded = true;
      },
      err => (this.loaded = true)
    );
  }

  private updateMinMaxFuel() {
    const data = this._fuelReport.getChartDataSets('total')[0].data;

    const chartData = (<number[]>data)
      .map(m => m)
      .filter(f => f > 0)
      .sort((a, b) => a - b);

    this.minFuel = getTwoDigit(chartData[0]);
    this.maxFuel = getTwoDigit(chartData.pop());
  }

  private updateCanvas(labels: string[], datasets: ChartDataSets[]): void {
    this.chartCanvas.config.data.datasets = datasets;
    this.chartCanvas.config.data.labels = labels;

    if (this.fuelBurnedUom) {
      this.chartCanvas.config.options.scales.yAxes[0].scaleLabel.labelString = this.fuelBurnedUom;
      this.chartCanvas.config.options.tooltips.callbacks = this._fuelReport.getChartTooltipCallback(
        this.fuelBurnedUom
      );
    } else {
      this.chartCanvas.config.options.scales.yAxes[0].scaleLabel.labelString = '';
    }

    this.chartCanvas.update();
  }
}
