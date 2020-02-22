import { Component, Input, ViewChild, ElementRef } from '@angular/core';

import { Chart, ChartDataSets } from 'chart.js';
import 'chartjs-chart-timeline';

import { FleetApiService } from '@fleet/services/fleet-api/fleet-api.service';
import { FleetDutyReportService } from '../../services/fleet-duty-report/fleet-duty-report.service';

import { getLastSevenDays, getReportRequest } from '../../fleet-detail-util';

@Component({
  selector: 'app-fleet-duty-report',
  templateUrl: './fleet-duty-report.component.html',
  styleUrls: ['./fleet-duty-report.component.css']
})
export class FleetDutyReportComponent {
  private _vehicleId: string;
  private _lastUpdate: string;
  private _componentLoaded: boolean;

  @ViewChild('dutyChart')
  public dutyChart: ElementRef;
  public canvasContext: CanvasRenderingContext2D;
  public chartCanvas: Chart;
  public totalDuration: string;
  public statusDuration: Map<string, string>;
  public loaded = false;

  constructor(private _fleetApi: FleetApiService, private _dutyReport: FleetDutyReportService) {}

  @Input()
  public set vehicleId(id: string) {
    this._vehicleId = id;
  }

  @Input()
  public set lastUpdate(date: string) {
    this.init();

    if (!this._componentLoaded) {
      this.canvasContext = (<HTMLCanvasElement>this.dutyChart.nativeElement).getContext('2d');
      this.chartCanvas = new Chart(this.canvasContext, this._dutyReport.chartConfiguration);

      this._componentLoaded = true;
    }

    if (date) {
      this.loaded = false;
      this._lastUpdate = date;

      this.getDutyReport();
    } else {
      this.updateCanvas([], []);

      this.loaded = true;
    }
  }

  private init(): void {
    this._dutyReport.init();

    this.totalDuration = this._dutyReport.totalDuration;
    this.statusDuration = this._dutyReport.statusDuration;
  }

  private getDutyReport(): void {
    this._fleetApi.getDutyReports(getReportRequest(this._vehicleId, this._lastUpdate)).subscribe(
      data => {
        if (data['segments']) {
          const segments: Array<any> = data['segments'];

          this._dutyReport.setupDutyReport(segments);

          this.totalDuration = this._dutyReport.totalDuration;
          this.statusDuration = this._dutyReport.statusDuration;

          const dutyData = this._dutyReport.getDutyData(segments, data['end']);
          const { labels, datasets } = this._dutyReport.getDutyChartData(dutyData);

          this.updateCanvas(labels || [], datasets || []);
        } else {
          this.updateCanvas(getLastSevenDays(data['end']), []);
        }

        this.loaded = true;
      },
      err => (this.loaded = true)
    );
  }

  private updateCanvas(labels: string[], datasets: ChartDataSets[]): void {
    this.chartCanvas.config.data.datasets = datasets;
    this.chartCanvas.config.data.labels = labels;
    this.chartCanvas.config.options.tooltips.callbacks = this._dutyReport.getChartTooltipCallbacks();

    this.chartCanvas.update();
  }
}
