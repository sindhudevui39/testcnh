import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectedVehicleService {
  private selectedVehicle = new BehaviorSubject(null);
  public selectedVehicle$ = this.selectedVehicle.asObservable();

  updateSelectedVehicle(vehicle) {
    this.selectedVehicle.next(vehicle);
  }
}
