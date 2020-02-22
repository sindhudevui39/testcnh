import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, pipe } from 'rxjs';
import { pluck, distinctUntilChanged, map } from 'rxjs/operators';
import { DataFileStore } from './data-file.store';
import { DataFile } from '../models/data-file.model';
import { combineLatest } from 'rxjs';
export interface IDataFilesFilters {
  searchString?: string;
  target?: string[];
}

export interface IOption {
  label: string;
  value: any;
}

export interface IFilter {
  type: string;
  value: any;
  target?: string[];
}

@Injectable()
export class DataFilesFilterService {
  public activeSearch$: Observable<string>;
  public filteredDataFiles$: Observable<DataFile[]>;

  private filters$: BehaviorSubject<IDataFilesFilters>;
  private dataFiles$: Observable<DataFile[]>;

  private _filters: IDataFilesFilters = {
    searchString: ''
  };

  constructor(public dataFileStore: DataFileStore) {
    this.filters$ = new BehaviorSubject(this._filters);
    this.dataFiles$ = this.dataFileStore.getList();

    this.activeSearch$ = this.filters$
      .pipe(pluck('searchString'))
      .pipe(distinctUntilChanged())
      .pipe(map((value: any) => (value ? `${value}` : '')));

    this.filteredDataFiles$ = combineLatest(
      this.dataFiles$,
      this.filters$
    ).pipe(
      map(([dataFiles, filters]) => {
        let filteredDataFiles = dataFiles;

        const searchString = filters.searchString;
        const targets = filters.target || ['name'];

        if (searchString) {
          filteredDataFiles = filteredDataFiles.filter(dataFile => {
            return targets.some(
              target =>
                (dataFile[target] &&
                  dataFile[target]
                    .trim()
                    .toLowerCase()
                    .indexOf(searchString.trim().toLowerCase()) !== -1) ||
                false
            );
          });
        }
        return filteredDataFiles;
      })
    );
  }

  public get filters() {
    return this.filters$;
  }

  public changeFilter(filter: IFilter) {
    this._filters[filter.type] = filter.value;
    this._filters['target'] = filter.target;
    this.filters$.next(this._filters);
  }

  public resetFilters() {
    Object.keys(this._filters)
      .filter(key => key !== 'searchString')
      .map(key => {
        this.changeFilter({ type: key, value: null });
      });
  }
}
