import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FleetOverviewSortService {
  isAscending = true;
  sortAttribute = 'name';
  overviewUnitsData: any;

  constructor() {}

  sortData(data) {
    if (this.isAscending) {
      data.sort((_obj1, _obj2) => this.customSort(_obj1, _obj2));
    } else {
      data.sort((_obj1, _obj2) => this.customSort(_obj2, _obj1));
    }

    return data;
  }

  customSort(a, b) {
    return a[this.sortAttribute].toLowerCase() > b[this.sortAttribute].toLowerCase()
      ? 1
      : a[this.sortAttribute].toLowerCase() < b[this.sortAttribute].toLowerCase()
      ? -1
      : 0;
  }
  setRefData(data) {
    this.overviewUnitsData = data;
  }

  sortPanelData() {
    for (const item in this.overviewUnitsData) {
      if (item) {
        for (const company in this.overviewUnitsData[item]) {
          if (company) {
            this.sortData(this.overviewUnitsData[item][company]);
          }
        }
      }
    }
  }
}
