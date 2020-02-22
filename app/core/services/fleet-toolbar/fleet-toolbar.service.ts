import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FleetToolbarService {
  private _allGrower = new BehaviorSubject('');

  public allGrower$ = this._allGrower.asObservable();
  constructor() {}

  allGrower(value: string) {
    this._allGrower.next(value);
  }
}
