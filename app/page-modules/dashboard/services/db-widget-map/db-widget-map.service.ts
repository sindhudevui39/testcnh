import { Injectable, Type } from '@angular/core';

import { DbVehicleSatusComponent } from '@dashboard/components/widgets/db-vehicle-satus/db-vehicle-satus.component';
import { DbFaultsComponent } from '@dashboard/components/widgets/db-faults/db-faults.component';
import { DbAreaCoveredComponent } from '@dashboard/components/widgets/db-area-covered/db-area-covered.component';
import { DbLowFuelComponent } from '@dashboard/components/widgets/db-low-fuel/db-low-fuel.component';
import { DbDailyFuelComponent } from '@dashboard/components/widgets/db-daily-fuel/db-daily-fuel.component';
import { DbTotalFuelComponent } from '@dashboard/components/widgets/db-total-fuel/db-total-fuel.component';
import { DbAddWidgetBtnComponent } from '@dashboard/components/layouts/db-add-widget-btn/db-add-widget-btn.component';

@Injectable({
  providedIn: 'root'
})
export class DbWidgetMapService {
  private _widgetMap: Map<string, Type<any>> = new Map();

  constructor() {
    this._widgetMap.set('vehicle-status', DbVehicleSatusComponent);
    this._widgetMap.set('active-high-severity-faults', DbFaultsComponent);
    this._widgetMap.set('area-covered', DbAreaCoveredComponent);
    this._widgetMap.set('low-fuel', DbLowFuelComponent);
    this._widgetMap.set('daily-fuel-consumption', DbDailyFuelComponent);
    this._widgetMap.set('total-fuel-consumption', DbTotalFuelComponent);
    this._widgetMap.set('add-widget-button', DbAddWidgetBtnComponent);
  }

  public getComponent(key: string): Type<any> {
    return this._widgetMap.get(key);
  }
}
