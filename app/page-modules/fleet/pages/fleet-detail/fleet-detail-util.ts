import * as Color from 'color';
import { ChartConfiguration } from 'chart.js';

import { StatusCode, StatusColor } from '@enums/vehicle-status.enum';

interface ReportRequest {
  id: string;
  start: string;
  end: string;
}

function getColorOption(color: Color) {
  return {
    luminosity: function() {
      return color.luminosity();
    },
    rgbaString: function() {
      return color.rgb().toString();
    }
  };
}

export const reportTimeFormat = 'MM-dd-yyyy';

export const mostConsumedFuelColor: string[] = [
  '#FF6C00',
  '#F57C00',
  '#FF9800',
  '#FCAA03',
  '#F9BC06',
  '#F3BC01',
  '#F9C516'
];

export function getLastSevenDays(endDate: string): Array<string> {
  const sevenDays: Array<Date> = [];

  for (let index = 0; index < 7; index++) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - index);

    sevenDays.push(date);
  }

  return sevenDays.map((m: Date) => m.toLocaleDateString());
}

export function getBaselineTime(date: Date): number {
  return new Date(2016, 0, 1, date.getHours(), date.getMinutes(), date.getSeconds()).getTime();
}

export function getTwoDigit(num: number): number {
  return Math.floor(num * 100) / 100 || 0;
}

export function getReportRequest(vehicleId: string, lastUpdated: string): ReportRequest {
  const date = new Date(lastUpdated);
  date.setUTCHours(0, 0, 0, 0);

  const start = new Date(date.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString();

  return {
    id: vehicleId,
    start,
    end: lastUpdated
  };
}

export const dutyReportChartOptions = {
  type: 'timeline',
  options: {
    elements: {
      colorFunction: function(text, data: Array<string>, dataset, index) {
        const status = data[data.length - 1];

        if (status === StatusCode.WORKING) {
          return getColorOption(Color(StatusColor.WORKING));
        } else if (status === StatusCode.KEYON) {
          return getColorOption(Color(StatusColor.KEYON));
        } else if (status === StatusCode.IDLE) {
          return getColorOption(Color(StatusColor.IDLE));
        } else if (status === StatusCode.MOVING) {
          return getColorOption(Color(StatusColor.MOVING));
        } else if (status === StatusCode.TRAVELING) {
          return getColorOption(Color(StatusColor.TRAVELING));
        }
      },
      showText: false,
      textPadding: 4
    },
    events: ['click'],
    scales: {
      xAxes: [
        {
          time: {
            unit: 'hour',
            unitStepSize: 2,
            min: new Date(2016, 0, 1, 0, 0).getTime(),
            max: new Date(2016, 0, 1, 24, 0).getTime()
          },
          scaleLabel: {
            display: true,
            labelString: 'HOURS'
          },
          ticks: {
            autoSkip: true
          },
          stacked: true
        }
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'DAYS'
          },
          stacked: true,
          barThickness: 15
        }
      ]
    },
    tooltips: {
      backgroundColor: '#fff',
      bodyFontColor: '#000',
      borderColor: '#ddd',
      borderWidth: 2,
      titleFontColor: '#707070',
      titleFontSize: 12,
      xPadding: 25,
      yPadding: 15
    }
  }
};

export const fuelReportChartOptions: ChartConfiguration = {
  type: 'bar',
  data: {
    labels: []
  },
  options: {
    events: ['click'],
    legend: { display: false },
    scales: {
      xAxes: [
        {
          barPercentage: 0.4,
          scaleLabel: {
            labelString: 'DAYS',
            display: true
          }
        }
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true
          },
          ticks: {
            beginAtZero: true
          }
        }
      ]
    },
    tooltips: {
      backgroundColor: '#fff',
      bodyFontColor: '#000',
      borderColor: '#ddd',
      borderWidth: 2,
      xPadding: 12,
      yPadding: 12,
      displayColors: false
    }
  }
};
