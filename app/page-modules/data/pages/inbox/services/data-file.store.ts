import { Injectable } from '@angular/core';
import { ReplaySubject, Subject, Observable, throwError } from 'rxjs';

import { AbstractCumulativeDataStore } from '../models/abstract.cumulative.store';

import { DataFileService } from './data-file.service';

import { DataFile } from '../models/data-file.model';

@Injectable()
export class DataFileStore extends AbstractCumulativeDataStore<DataFile> {
  public filter$: ReplaySubject<any> = new ReplaySubject(1);
  public totalDataFiles$: Subject<number> = new Subject<number>();
  constructor(private api: DataFileService) {
    super();
  }

  public addFilters(value: any): void {
    this.filter$.next(value);
  }

  public fetch(type) {
    this.loading = true;
    this.api.get(type).subscribe(
      response => {
        this.loading = false;
        this.addFilters(response);
        this.totalDataFiles$.next(response.length);
        this.add(response);
      },
      err => console.log(err)
    );
  }
}
