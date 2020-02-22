import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PingService {
  private _unitsData = new BehaviorSubject<any[]>([]);
  public unitsData$ = this._unitsData.asObservable();

  constructor() {}

  public unitsUpdated(units: any[]): void {
    this._unitsData.next(units);
  }
}
