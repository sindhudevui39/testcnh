import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  ChartConfiguration,
  ChartDataSets,
  ChartTooltipItem,
  ChartTooltipCallback
} from 'chart.js';
import {
  fuelReportChartOptions,
  getLastSevenDays,
  mostConsumedFuelColor,
  reportTimeFormat
} from '../../fleet-detail-util';
import { UserService } from '@services/user/user.service';

interface IFuelData {
  fuelBurnData: any;
  durationData: any;
}

interface IFuelDataSets {
  totalFuelDataSets: number[];
  averageFuelDataSets: number[];
}

@Injectable({
  providedIn: 'root'
})
export class FleetFuelReportService {
  private _totalFuelBurnDataSets: Array<ChartDataSets>;
  private _averageFuelBurnDataSets: Array<ChartDataSets>;
  private _isChartDataAvailable: boolean;
  private _chartConfiguration: ChartConfiguration;

  constructor(private _datePipe: DatePipe, private _userService: UserService) {}

  public init() {
    this._totalFuelBurnDataSets = [];
    this._averageFuelBurnDataSets = [];
    this._isChartDataAvailable = false;
    this._chartConfiguration = { ...fuelReportChartOptions };
  }

  public get isChartDataAvailable(): boolean {
    return this._isChartDataAvailable;
  }

  public set isChartDataAvailable(value: boolean) {
    this._isChartDataAvailable = value;
  }

  public get chartConfiguration(): ChartConfiguration {
    return this._chartConfiguration;
  }

  public setupFuelDataSets(data: any, labels: string[]): void {
    const { fuelBurnData, durationData } = this.getFuelData(data, labels);
    const { totalFuelDataSets, averageFuelDataSets } = this.getDataSets(fuelBurnData, durationData);

    this._totalFuelBurnDataSets = [
      {
        data: totalFuelDataSets,
        backgroundColor: this.getChartColor(totalFuelDataSets)
      }
    ];

    this._averageFuelBurnDataSets = [
      {
        data: averageFuelDataSets,
        backgroundColor: this.getChartColor(averageFuelDataSets)
      }
    ];
  }

  public getChartLabels(end: string): string[] {
    return end
      ? getLastSevenDays(end)
          .map(m => this._datePipe.transform(m, reportTimeFormat))
          .reverse()
      : [];
  }

  public getChartDataSets(selectedOption: string): ChartDataSets[] {
    if (selectedOption === 'total') {
      return this._totalFuelBurnDataSets;
    } else {
      return this._averageFuelBurnDataSets;
    }
  }

  public getChartTooltipCallback(uom: string): ChartTooltipCallback {
    return {
      title: () => '',
      label: (tooltipItem: ChartTooltipItem, tooltipData: any) => {
        const value = Math.floor(Number(tooltipItem.yLabel) * 100) / 100;

        return `${value} ${uom}`;
      }
    };
  }

  private getFuelData(data: any, labels: string[]): IFuelData {
    const dataBucket: Array<any> = data['buckets'];

    const fuelBurnData = {};
    const durationData = {};

    labels.forEach((day: string) => {
      fuelBurnData[day] = 0.0;
      durationData[day] = 0.0;

      dataBucket.forEach(fuelData => {
        const fuelDate = this._datePipe.transform(fuelData['start'], reportTimeFormat);

        if (day === fuelDate) {
          const fuelBurn = fuelBurnData[day] + fuelData['burned'];
          const duration = durationData[day] + fuelData['duration'];

          fuelBurnData[day] = fuelBurn;
          durationData[day] = duration;
        }
      });
    });

    return {
      fuelBurnData,
      durationData
    };
  }

  private getDataSets(fuelBurnData: any, durationData: any): IFuelDataSets {
    const totalFuelDataSets: Array<number> = [];
    const averageFuelDataSets: Array<number> = [];

    for (const key in fuelBurnData) {
      if (fuelBurnData.hasOwnProperty(key)) {
        const totalFuel = fuelBurnData[key];
        const hours = durationData[key] / 3600;

        totalFuelDataSets.push(totalFuel);
        averageFuelDataSets.push(totalFuel / hours);
      }
    }

    return {
      totalFuelDataSets,
      averageFuelDataSets
    };
  }

  private getChartColor(dataSet: number[]): string[] {
    const consumedColors: string[] = new Array(7).fill('');
    const numDataSet = dataSet.map(item => (!item ? 0 : item));

    for (let i = 0; i < mostConsumedFuelColor.length; i++) {
      const maxFuel = Math.max(...numDataSet);

      if (maxFuel === 0) {
        break;
      }

      const maxFuelIndex = numDataSet.indexOf(maxFuel);

      consumedColors[maxFuelIndex] = mostConsumedFuelColor[i];
      numDataSet[maxFuelIndex] = 0;
    }

    return consumedColors;
  }
}
