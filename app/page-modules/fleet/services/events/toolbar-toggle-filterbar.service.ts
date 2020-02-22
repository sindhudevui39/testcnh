import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToolbarToggleFilterbarService {
  private openFiltersBar = new BehaviorSubject(false);
  public openFiltersBar$ = this.openFiltersBar.asObservable();

  constructor() {}

  updateOpenFiltersBar(value) {
    this.openFiltersBar.next(value);
  }
}
