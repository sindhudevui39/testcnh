import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { FotaService } from './fota/fota.service';

const COMPANY_DEFAULT_SELECTION = 'all_companies';
const VEHICLE_DEFAULT_SELECTION = 'all_vehicles';
const MODEL_DEFAULT_SELECTION = 'all_models';

@Injectable({
  providedIn: 'root'
})
export class FotaFilterService {
  x = 0;
  y = 0;
  selectedOrder = true;
  selectedAttr = 'installed';
  selectedCompany: string;
  selectedVehicle: string;
  selectedModel: string;
  defaultCompanyValue: string;
  defaultVehicleValue: string;
  defaultModelValue: string;
  searchString: string;
  vehicleList = [];
  vehicleList$ = new BehaviorSubject<any[]>(null);

  constructor() {}

  sortBy(attr, order, list) {
    if (order) {
      this.x = 1;
      this.y = -1;
    } else {
      this.x = -1;
      this.y = 1;
    }
    switch (attr) {
      case 'notified':
        list.sort((a, b) => this.sortFunc(a.status.toLowerCase(), b.status.toLowerCase()));
        break;

      case 'downloaded':
        list.sort((a, b) => this.sortFunc(a.status.toLowerCase(), b.status.toLowerCase()));
        break;
      case 'installed':
        list.sort((a, b) => this.sortFunc(a.status.toLowerCase(), b.status.toLowerCase()));
        break;
    }
  }

  sortFunc(a, b) {
    if (a < b) {
      return this.x;
    }

    if (a > b) {
      return this.y;
    }

    return 0;
  }

  public filterVehicleSelection(event: any, dropdownType: string): void {
    let filteredData = [];
    const name = event.value;

    switch (dropdownType) {
      case 'COMPANY_DROPDOWN':
        this.selectedCompany = name;

        if (event.value === COMPANY_DEFAULT_SELECTION) {
          filteredData = this.vehicleList;
        } else {
          filteredData = this.filterByCompany(this.selectedCompany, this.vehicleList);
        }
        if (this.selectedVehicle !== this.defaultVehicleValue) {
          filteredData = this.filterByVehicle(this.selectedVehicle, filteredData);
        }

        if (this.selectedModel !== this.defaultModelValue) {
          filteredData = this.filterByModel(this.selectedModel, filteredData);
        }

        break;

      case 'VEHICLE_DROPDOWN':
        this.selectedVehicle = name;

        if (event.value === VEHICLE_DEFAULT_SELECTION) {
          filteredData = this.vehicleList;
        } else {
          filteredData = this.filterByVehicle(this.selectedVehicle, this.vehicleList);
        }

        if (this.selectedCompany !== this.defaultCompanyValue) {
          filteredData = this.filterByCompany(this.selectedCompany, filteredData);
        }

        if (this.selectedModel !== this.defaultModelValue) {
          filteredData = this.filterByModel(this.selectedModel, filteredData);
        }

        break;

      case 'MODEL_DROPDOWN':
        this.selectedModel = name;

        if (event.value === MODEL_DEFAULT_SELECTION) {
          filteredData = this.vehicleList;
        } else {
          filteredData = this.filterByModel(name, this.vehicleList);
        }

        if (this.selectedCompany !== this.defaultCompanyValue) {
          filteredData = this.filterByCompany(this.selectedCompany, filteredData);
        }

        if (this.selectedVehicle !== this.defaultVehicleValue) {
          filteredData = this.filterByVehicle(this.selectedVehicle, filteredData);
        }

        break;
    }

    this.vehicleList$.next(filteredData);
  }

  private filterByCompany(company: string, dataToFilter: any): any {
    const filteredData = [];

    for (let i = 0; i < dataToFilter.length; i++) {
      if (dataToFilter[i].companyName === company) {
        filteredData.push(dataToFilter[i]);
      }
    }

    return filteredData;
  }

  private filterByVehicle(vehicle: string, dataToFilter: any): any {
    const filteredData = [];

    for (let i = 0; i < dataToFilter.length; i++) {
      if (dataToFilter[i].vehicleName === vehicle) {
        filteredData.push(dataToFilter[i]);
      }
    }

    return filteredData;
  }

  private filterByModel(model: string, dataToFilter: any): any {
    const filteredData = [];

    for (let i = 0; i < dataToFilter.length; i++) {
      if (dataToFilter[i].model === model) {
        filteredData.push(dataToFilter[i]);
      }
    }

    return filteredData;
  }

  public vehicleSelectionSearch(searchString: string): boolean {
    const filteredData =
      this.vehicleList$.getValue().length > 0 ? this.vehicleList$.getValue() : this.vehicleList;
    let filteredSearchCount = 0;

    if (searchString) {
      let filteredSearchData = [];

      const filteredValues = filteredData.filter(
        f =>
          f.vehicleName.toLowerCase().includes(searchString) ||
          f.companyName.toLowerCase().includes(searchString) ||
          f.model.toLowerCase().includes(searchString)
      );

      if (filteredValues.length > 0) {
        filteredSearchData = [...filteredValues];
        filteredSearchCount++;
      }

      if (filteredSearchCount === 0) {
        this.selectedCompany = this.defaultCompanyValue;
        this.selectedVehicle = this.defaultVehicleValue;
        this.selectedModel = this.defaultModelValue;
      }

      this.vehicleList$.next(filteredSearchData);
    } else {
      this.vehicleList$.next(this.vehicleList);
    }

    return filteredSearchCount === 0;
  }

  public removeVehicle(id: string) {}
}
