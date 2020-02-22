import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ApiService } from '@services/api/api.service';
import { VehicleInfo } from '@fleet/pages/fleet-detail/fleet-detail.component';

@Injectable({
  providedIn: 'root'
})
export class FleetVehicleInfoService {
  public vehicleInfo: VehicleInfo;
  public vehicleId: string;
  public lastUpdate: string;

  public vehicleData: any;
  constructor(private _apiService: ApiService) {}

  getVehicleDataById(id: string): Observable<any> {
    const resData: Subject<any> = new Subject<any>();
    this._apiService.getVehicleDataById(id).subscribe(data => {
      this.vehicleInfo = {
        brand: data.brand,
        company: data.fleets[0].name,
        isStatusClimateDisconnected: data.capabilities
          ? data.capabilities.isDisabled
            ? data.capabilities.isDisabled
            : false
          : false,
        lastUpdate: data.lastUpdate,
        model: data.model,
        name: data.name,
        parameters: data.parameters,
        pin: data.serialNumber,
        status: data.status ? data.status.name : 'UNKNOWN',
        type: data.type.name
      };

      this.vehicleId = data.id;
      this.lastUpdate = data.lastUpdate;
      resData.next(this.vehicleData);
    });
    return resData.asObservable();
  }
}
