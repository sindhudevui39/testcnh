import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FleetFilterEventsService {
  public searchValue$ = new BehaviorSubject<string>('');

  constructor() {}

  updateSearchValue(value) {
    this.searchValue$.next(value);
  }
}
