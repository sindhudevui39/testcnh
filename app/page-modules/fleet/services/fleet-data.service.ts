import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FleetDataService {
  public storage: any;
  public tempStorage: any;
  public vehicleDetail: any;
  public vehicleId: any = {};
  public vehicleCount: any;
  public showMapVehicleInfo: any = false;
  public showOverviewNav: any = false;
  public vehicleChange: any = false;

  public vehicleMapData: any;

  constructor() {}
}
