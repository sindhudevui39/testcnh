export const BIG_WIDGET_HEIGHT = '348';
export const SMALL_WIDGET_HEIGHT = '224';

export enum Widgets {
  VEHICLE_STATUS = 'vehicle-status',
  FAULTS = 'active-high-severity-faults',
  AREA_COVERED = 'area-covered',
  LOW_FUEL = 'low-fuel',
  DAILY_FUEL_CONSUMPTION = 'daily-fuel-consumption',
  TOTAL_FUEL_CONSUMPTION = 'total-fuel-consumption',
  ADD_WIDGET_BUTTON = 'add-widget-button'
}

export const defaultPreference: Array<string> = [
  Widgets.VEHICLE_STATUS,
  Widgets.FAULTS,
  Widgets.AREA_COVERED,
  Widgets.LOW_FUEL,
  Widgets.DAILY_FUEL_CONSUMPTION,
  Widgets.TOTAL_FUEL_CONSUMPTION,
  Widgets.ADD_WIDGET_BUTTON
];

export interface WidgetOrder {
  element: string;
  index: number;
}
