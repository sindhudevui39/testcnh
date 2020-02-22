import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const ASCENDING = 'ASC';
const DESCENDING = 'DESC';

@Injectable({
  providedIn: 'root'
})
export class FotaService {
  public campaignList = [];
  public selectedCampaign: any;
  public isCampaignDesc = true;
  public vehicleList = [];
  public vehicleSortOrder: string;
  public selectedVehicles = [];
  public selectedVehicles$ = new BehaviorSubject<any[]>([]);
  public vehicleRemoved$ = new BehaviorSubject<any>(null);

  constructor() {}

  public reset(): void {
    this.campaignList = [];
    this.selectedCampaign = null;
    this.isCampaignDesc = true;

    this.resetSelectedVehicles();
  }

  public resetSelectedVehicles(): void {
    this.vehicleList = [];
    this.vehicleSortOrder = '';
    this.selectedVehicles = [];
    this.selectedVehicles$.next([]);
    this.vehicleRemoved$.next(null);
  }

  public vehicleSelected(vehicle: any): void {
    this.selectedVehicles.push(vehicle);
    this.selectedVehicles$.next(this.selectedVehicles);
  }

  public removeSelectedVehicle(id: string, summary?: boolean): void {
    const vehicleList = this.selectedVehicles$.getValue();
    let vehicle: any;

    for (let i = 0; i < vehicleList.length; i++) {
      const element = vehicleList[i];

      if (element.id === id) {
        vehicle = element;
        vehicleList.splice(i, 1);
      }
    }

    this.selectedVehicles$.next(vehicleList);
    this.vehicleRemoved$.next({ vehicle, summary });
  }

  public selectAllVehicles(vehicles: any[]): void {
    this.selectedVehicles = vehicles;
    this.selectedVehicles$.next(this.selectedVehicles);
  }

  public removeAllVehicles(): void {
    this.selectedVehicles = [];
    this.selectedVehicles$.next(this.selectedVehicles);
  }
}
