import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

import { ChartTooltipItem } from 'chart.js';

import { StatusCode } from '@enums/vehicle-status.enum';
import {
  getLastSevenDays,
  getBaselineTime,
  reportTimeFormat,
  dutyReportChartOptions
} from '../../fleet-detail-util';
import { UserService } from '@services/user/user.service';

interface IDutyLabelDatasets {
  labels: Array<string>;
  datasets: Array<any>;
}

@Injectable({
  providedIn: 'root'
})
export class FleetDutyReportService {
  private _statusDuration: Map<string, string>;
  private _totalDuration = 'N/A';
  private _chartConfiguration: any;

  constructor(private _datePipe: DatePipe, private _userService: UserService) {}

  public get totalDuration(): string {
    return this._totalDuration;
  }

  public get statusDuration(): Map<string, string> {
    return this._statusDuration;
  }

  public get chartConfiguration(): any {
    return this._chartConfiguration;
  }

  public init() {
    this._statusDuration = new Map<string, string>();

    this._statusDuration.set(StatusCode.WORKING, 'N/A');
    this._statusDuration.set(StatusCode.KEYON, 'N/A');
    this._statusDuration.set(StatusCode.IDLE, 'N/A');
    this._statusDuration.set(StatusCode.MOVING, 'N/A');
    this._statusDuration.set(StatusCode.TRAVELING, 'N/A');

    this._totalDuration = 'N/A';

    this._chartConfiguration = { ...dutyReportChartOptions };
  }

  public getChartTooltipCallbacks() {
    return {
      title: (tooltipItem: Array<ChartTooltipItem>, tooltipData: any) => {
        const data = tooltipData.datasets[tooltipItem[0].datasetIndex].data[tooltipItem[0].index];

        return `${this._datePipe.transform(data[0], 'shortTime')} - ${this._datePipe.transform(
          data[1],
          'shortTime'
        )}`;
      },
      label: (tooltipItem: ChartTooltipItem, tooltipData: any) => {
        const data = tooltipData.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

        return data[2];
      },
      afterLabel: (tooltipItem: ChartTooltipItem, tooltipData: any) => {
        const data = tooltipData.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

        const diff = data[1] - data[0];

        let msec = diff;

        const hh = Math.floor(msec / 1000 / 60 / 60);
        msec -= hh * 1000 * 60 * 60;

        const mm = Math.floor(msec / 1000 / 60);
        msec -= mm * 1000 * 60;

        const ss = Math.floor(msec / 1000);
        msec -= ss * 1000;

        return (hh + mm + ' m').trim();
      }
    };
  }

  public setupDutyReport(segments: Array<any>) {
    this.setupTotalDuration(segments);
    this.setupTimeDisplay();
  }

  public getDutyData(segments: Array<any>, endDate: string): any {
    const dutyData: any = {};

    getLastSevenDays(endDate).forEach(date => (dutyData[date] = []));

    if (segments.length > 0) {
      segments.forEach(segment => {
        const localStartDate = new Date(segment['start']);
        const localEndDate = new Date(segment['end']);

        const start: string = localStartDate.toLocaleDateString();
        const status: string = segment['statusName'];

        if (Object.keys(dutyData).includes(start)) {
          dutyData[start].push([
            getBaselineTime(localStartDate),
            getBaselineTime(localEndDate),
            status
          ]);
        }
      });
    }

    return dutyData;
  }

  public getDutyChartData(dutyData: any): IDutyLabelDatasets {
    const labels: Array<string> = [];
    const datasets: Array<any> = [];

    for (const key in dutyData) {
      if (dutyData.hasOwnProperty(key)) {
        const element = dutyData[key];

        labels.push(this._datePipe.transform(key, reportTimeFormat));

        const chartData: any = {
          data: [...element]
        };

        datasets.push(chartData);
      }
    }

    return { labels, datasets };
  }

  private setupTotalDuration(segments: Array<any>) {
    let totalTime = 0;

    segments.forEach(segment => {
      const key: string = segment.statusName;

      if (this._statusDuration.get(key) === 'N/A') {
        this._statusDuration.set(key, '0');
      }

      let time = parseInt(this._statusDuration.get(key), 10);

      time += 900;

      this._statusDuration.set(key, time.toString());

      totalTime += 900;
    });

    const hours = Math.floor(totalTime / 3600);
    const minutes = Math.floor((totalTime - hours * 3600) / 60);

    this._totalDuration = this.generateTimeString(hours, minutes);
  }

  private setupTimeDisplay() {
    this._statusDuration.forEach((val, key) => {
      let seconds = parseInt(val, 10);
      const hours = Math.floor(seconds / 3600);

      seconds = seconds % 3600;

      const minutes = Math.floor(seconds / 60);

      const totalStatusTime = this.generateTimeString(hours, minutes);

      this._statusDuration.set(key, totalStatusTime.trim());
    });
  }

  private generateTimeString(hours: number, minutes: number): string {
    let totalTime = '';

    if (hours) {
      totalTime += `${hours} h `;
    }

    if (minutes) {
      totalTime += `${minutes} m`;
    }

    if (!totalTime) {
      totalTime = 'N/A';
    }

    return totalTime;
  }
}
