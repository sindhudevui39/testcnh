import { Injectable } from '@angular/core';
import { ISortObj } from '../components/cnh-sortable-item/cnh-sortable-item.component';
import { BehaviorSubject } from 'rxjs';

/**
 * Possible dataFiles sorting by properties
 */
// export enum DataFileSortBy {
//   NAME = 'name',
//   SOURCE = 'source',
//   SIZE = 'bytesToSize',
//   DATE = 'creationDate'
// }

// export enum PartnerSortBy {
//   NAME = 'name',
//   EMAIL = 'email',
// }

// export enum FieldSortBy {
//   NAME = 'name',
// }
export enum DataFileSortBy {
  NAME,
  SOURCE,
  SIZE,
  DATE
}

export enum PartnerSortBy {
  NAME,
  EMAIL
}

export enum FieldSortBy {
  NAME
}

/**
 * Handle global stater for files ordering
 */
@Injectable()
export class GlobalSortingService {
  public sortDefault$: BehaviorSubject<ISortObj> = new BehaviorSubject<
    ISortObj
  >(null);
  public isActive$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  public constructor() {
    //
  }

  /**
   * Sets the sort by to an array of possible sortings, applied in order.
   * @param sortObj accepts key/order params
   */
  public sortBy(sortObj: any) {
    for (const enumList of [DataFileSortBy, PartnerSortBy, FieldSortBy]) {
      for (const enumItem in enumList) {
        if (enumList[enumItem] === sortObj.key) {
          this.sortDefault$.next(sortObj);
          this.isActive$.next(sortObj.key);
          return;
        }
      }
    }
  }
}
