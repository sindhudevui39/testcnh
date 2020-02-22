import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { FleetUrls } from './fleet-urls.enum';

@Injectable({
  providedIn: 'root'
})
export class FleetApiService {
  constructor(private _http: HttpClient) {}

  public getDutyReports({ id, start, end }): Observable<any> {
    const url = `${FleetUrls.VEHICLE_CHART_DATA}/${id}/${start}/${end}`;

    return this._http.get(url);
  }

  public getFuelReports({ id, start, end }): Observable<any> {
    const url = `${FleetUrls.VEHICLE_FUEL_DATA}/${id}/${start}/${end}`;

    return this._http.get(url);
  }
}
