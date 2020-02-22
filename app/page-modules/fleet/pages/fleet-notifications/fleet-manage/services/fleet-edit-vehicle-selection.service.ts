import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { FleetVehicle } from '@models/fleet-vehicle';
import { BehaviorSubject } from 'rxjs';
import { FleetUrls } from '@fleet/services/fleet-api/fleet-urls.enum';
import { FleetUtilService } from '@fleet/services/fleet-util/fleet-util.service';

const FLEET_DEFAULT_SELECTION = 'all_fleets';
const MODEL_DEFAULT_SELECTION = 'all_models';

@Injectable({
  providedIn: 'root'
})
export class FleetEditVehicleSelectionService {
  private _vehicleList: any;
  public vehicleList$ = new BehaviorSubject<any>(null);
  companyId: any;

  public phoneNumber$ = new BehaviorSubject<boolean>(null);
  vehiclesNotificationList: any[];

  fleetDropdownTitle: string;
  modelDropdownTitle: string;

  defaultFleetTitle: string;
  defaultModelTitle: string;

  constructor(private http: HttpClient, private fleetUtilService: FleetUtilService) {}

  public getIntialVehicleData() {
    return this._vehicleList;
  }

  public vehicleList() {
    this.http
      .get(FleetUrls.VEHICLE_DATA)
      .pipe(
        map(data => {
          return this.getVehicles(data['content']);
        })
      )
      .subscribe(data => {
        this._vehicleList = { ...data };
        this.vehicleList$.next(this._vehicleList);
      });
  }

  getVehicles(data) {
    const vehicles = {};

    Array.from(new Set(data.sort((b, a) => this.sortByName(a.name, b.name))));
    data.forEach(item => {
      const vehicle: FleetVehicle = {
        id: item.id,
        name: item.name,
        model: item.model,
        fleet: item.fleets,
        isClimateVehicle: false
      };
      const key = item.fleets[0].name;

      if (!(key in vehicles)) {
        vehicles[key] = [];
      }
      if (!this.fleetUtilService.isDeviceTypeCFV(item.capabilities)) {
        vehicles[key].push(vehicle);
      }
    });

    return vehicles;
  }
  sortByName(a, b): number {
    a = a.toLowerCase();
    b = b.toLowerCase();
    return a > b ? -1 : b > a ? 1 : 0;
  }

  public filterVehicleSelection(event: any, dropdownType: string): void {
    let filteredData: any;

    const name = event.name;

    switch (dropdownType) {
      case 'FLEET_DROPDOWN':
        this.fleetDropdownTitle = name;

        if (event.id === FLEET_DEFAULT_SELECTION) {
          filteredData = this._vehicleList;
        } else {
          filteredData = {
            [event.name]: this._vehicleList[event.name]
          };
        }

        if (this.modelDropdownTitle !== this.defaultModelTitle) {
          filteredData = this.filterByModel(this.modelDropdownTitle, filteredData);
        }

        break;
      case 'MODEL_DROPDOWN':
        this.modelDropdownTitle = name;
        if (event.id === MODEL_DEFAULT_SELECTION) {
          filteredData = this._vehicleList;
        } else {
          filteredData = this.filterByModel(name, this._vehicleList);
        }

        if (this.fleetDropdownTitle !== this.defaultFleetTitle) {
          filteredData = {
            [this.fleetDropdownTitle]: filteredData[this.fleetDropdownTitle]
          };
        }

        break;
    }

    this.vehicleList$.next(filteredData);
  }

  public vehicleSelectionSearch(event: any): void {
    let filteredData: any;

    if (this.fleetDropdownTitle === this.defaultFleetTitle) {
      filteredData = this._vehicleList;
    } else {
      filteredData = {
        [this.fleetDropdownTitle]: this._vehicleList[this.fleetDropdownTitle]
      };
    }

    if (this.modelDropdownTitle !== this.defaultModelTitle) {
      filteredData = this.filterByModel(this.modelDropdownTitle, filteredData);
    }

    const searchString = event.searchString.toLowerCase();

    if (searchString) {
      const filteredSearchData = {};
      let filteredSearchCount = 0;

      for (const key in filteredData) {
        if (key) {
          const val = filteredData[key] as Array<any>;

          const filteredValues = val.filter(
            f =>
              f.name.toLowerCase().includes(searchString) ||
              f.id.toLowerCase().includes(searchString) ||
              f.model.toLowerCase().includes(searchString)
          );

          if (filteredValues.length > 0) {
            filteredSearchData[key] = [...filteredValues];
            filteredSearchCount++;
          }
        }
      }

      if (filteredSearchCount === 0) {
        this.fleetDropdownTitle = this.defaultFleetTitle;
        this.modelDropdownTitle = this.defaultModelTitle;
      }

      this.vehicleList$.next(filteredSearchData);
    } else {
      this.vehicleList$.next(filteredData);
    }
  }
  private filterByModel(model: string, dataToFilter: any): any {
    const filteredData = {};

    for (const key in dataToFilter) {
      if (key) {
        const data = dataToFilter[key];
        for (let i = 0; i < data.length; i++) {
          if (data[i].model === model) {
            if (!(key in filteredData)) {
              filteredData[key] = [];
            }

            filteredData[key].push(data[i]);
          }
        }
      }
    }
    return filteredData;
  }

  setVehiclesNotification(list) {
    this.vehiclesNotificationList = [...list];
  }
  getVehiclesNotification() {
    return this.vehiclesNotificationList;
  }
}
