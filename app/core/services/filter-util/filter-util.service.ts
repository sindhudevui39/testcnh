import { Injectable } from '@angular/core';

import { FilterModel } from '@fleet/services/fleet-filter/fleet-filter.service';

@Injectable({
  providedIn: 'root'
})
export class FilterUtilService {
  constructor() {}

  isValuePresent(arr: Array<FilterModel>, str: string): boolean {
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];

      if (element.name === str) {
        return true;
      }
    }

    return false;
  }

  sortDropdownArray(a: FilterModel, b: FilterModel): number {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }
}
