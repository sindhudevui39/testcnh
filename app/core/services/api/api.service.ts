import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, shareReplay, catchError } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { UtilService } from '../util/util.service';
import { FleetFilterEventsService } from '@fleet/services/events/fleet-filter-events.service';
import { FleetUrls } from '@fleet/services/fleet-api/fleet-urls.enum';
import { Urls } from '@enums/urls.enum';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private vehicleData: any;
  private faultsData: any;
  private areaCoveredData: any;
  private dailyFuelConsumptionData: any;
  private totalFuelConsumptionData: any;
  public vehicleChartData: any;
  public vehicleDataById: any;
  private vehileChartUrl: any;
  private vehicleDataByIdUrl: any;
  private fleetUserPreferences: any;

  constructor(private http: HttpClient, private utilService: UtilService) {
    this.vehicleData = this.http.get(FleetUrls.VEHICLE_DATA).pipe(
      map(data => {
        return this.filterVehicleData(data['content']);
      }),
      shareReplay(1)
    );

    this.faultsData = this.http.get(Urls.FAULT).pipe(
      map(data => {
        return this.filteredFaultsData(data['content']);
      }),
      shareReplay(1)
    );

    const dailyFuelConsumptionRequest = {
      start: this.utilService.getCurrentISOTime(0),
      end: this.utilService.getCurrentISOTime(1),
      aggregations: [{ column: '__FUEL_BURNED', operator: 'INTEGRAL' }],
      filters: [{ column: '__vehicle' }]
    };

    this.dailyFuelConsumptionData = this.http
      .post(Urls.AREA_COVERED, dailyFuelConsumptionRequest)
      .pipe(shareReplay(1));

    const totalFuelConsumptionRequest = {
      start: this.utilService.getCurrentISOTime(0),
      end: this.utilService.getCurrentISOTime(6),
      aggregations: [{ column: '__FUEL_BURNED', operator: 'INTEGRAL' }],
      filters: [{ column: '__day' }]
    };

    this.totalFuelConsumptionData = this.http
      .post(Urls.AREA_COVERED, totalFuelConsumptionRequest)
      .pipe(shareReplay(1));

    const areaCoveredRequest = {
      start: this.utilService.getCurrentISOTime(0),
      end: this.utilService.getCurrentISOTime(1),
      columns: ['AREA_WORKED']
    };

    this.areaCoveredData = this.http
      .post(Urls.AREA_COVERED, areaCoveredRequest)
      .pipe(shareReplay(1));
  }
  getClimateAuthCode(code: string, url: string) {
    let urldata = url + `code=${code}`;

    try {
      this.http.get(`${Urls.CLIMATE_ACCESS_TOKEN}?url=${url}code=${code}`, {}).subscribe(
        resp => {
          localStorage.setItem('resp', JSON.stringify(resp));
        },
        err => {
          console.log('User authentication failed!', err);
        }
      );
    } catch (ex) {
      console.log(ex);
    }
  }

  getVehicleData() {
    return this.vehicleData;
  }

  getVehicleDataById(id: string): Observable<any> {
    return this.http.get(`${FleetUrls.VEHICLE_DATA}${id}`);
  }

  getVehicleChartData(id: string, start: any, end: any): Observable<Response> {
    this.vehileChartUrl = `${FleetUrls.VEHICLE_CHART_DATA}/${id}/${start}/${end}`;
    const resData: Subject<Response> = new Subject<Response>();
    this.http
      .get(this.vehileChartUrl, {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      })
      .subscribe((res: Response) => {
        resData.next(res);
      });
    return resData.asObservable();
  }

  getVehicleFuelData(id: string, start: any, end: any): Observable<Response> {
    this.vehileChartUrl = `${FleetUrls.VEHICLE_FUEL_DATA}/${id}/${start}/${end}`;
    const resData: Subject<Response> = new Subject<Response>();
    this.http
      .get(this.vehileChartUrl, {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      })
      .subscribe((res: Response) => {
        resData.next(res);
      });
    return resData.asObservable();
  }

  getTotalFuelConsumptionData() {
    return this.totalFuelConsumptionData;
  }

  getDailyFuelConsumptionData() {
    return this.dailyFuelConsumptionData;
  }

  getFaultsData() {
    return this.faultsData;
  }

  getAreaCoveredData() {
    return this.areaCoveredData;
  }

  filterVehicleData(vehicleData: any) {
    const vehicles = [];

    if (vehicleData) {
      vehicleData.forEach(element => {
        vehicles.push(element);
      });
    }

    return vehicles;
  }

  public getDataAuthorizationCode() {
    return this.http.get(`${Urls.DATA_AUTH_CODE}`);
  }

  filteredFaultsData(vehicleData: any) {
    const vehicles = [];

    if (vehicleData) {
      vehicleData.forEach(element => {
        if (element['severity'] === 'HIGH') {
          vehicles.push(element);
        }
      });
    }

    return vehicles;
  }

  getAllowedParams(): Observable<any> {
    const res = this.http.get(FleetUrls.ALLOWED_PARAMS);
    return res;
  }

  getUnitFaults(id?: string) {
    let url = `${FleetUrls.FLEET_ALL_FAULTS_DETAILS}`;

    if (id) {
      url = `${FleetUrls.FLEET_FAULTS_BY_ID}?id=${id}`;
    }

    return this.http.get(url);
  }

  getFaultHistory(date: string, id: string, code: string, page: number) {
    const url = `${FleetUrls.FLEET_FAULTS_HISTORY}/${id}/${code}/${date}/${page}`;

    return this.http.get(url);
  }

  getMaintenanceConfiguration() {
    return this.http.get('assets/maintenance_response.json');
  }

  getFleetUserPreferences() {
    return this.http.get(FleetUrls.FLEET_USER_PREFERENCES_GET);
  }

  updateFleetUserPreferences(preferences) {
    const url = FleetUrls.FLEET_USER_PREFERENCES_PUT;

    return this.http
      .put('api/fleet/put/userpreferences', preferences)
      .pipe(catchError(preferences));
  }
}
