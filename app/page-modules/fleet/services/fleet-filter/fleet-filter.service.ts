import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

export interface FleetFilters {
  fleets: Array<string>;
  types: Array<string>;
  brands: Array<string>;
  models: Array<string>;
}

export interface FaultFilters {
  severities: Array<string>;
  statuses: Array<string>;
}

export interface FilterModel {
  id?: string;
  name?: string;
  checked?: boolean;
  disabled?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FleetFilterService {
  private _fleetFilters: FleetFilters = {
    fleets: [],
    types: [],
    brands: [],
    models: []
  };

  private _faultFilters: FaultFilters = {
    severities: [],
    statuses: []
  };

  private _selectedFilter: string;

  public filterUpdated$ = new BehaviorSubject<boolean>(false);
  public appliedFiltersCount$ = new BehaviorSubject<any>(0);

  constructor(private _router: Router) {
    if (this._router.url.split('/').includes('faults')) {
      this.appliedFiltersCount$.next(1);
    } else {
      this.appliedFiltersCount$.next(0);
    }
  }

  public get faultFilters() {
    return this._faultFilters;
  }

  public get fleetFilters() {
    return this._fleetFilters;
  }

  public get selectedFilter() {
    return this._selectedFilter;
  }

  public set selectedFilter(value: string) {
    this._selectedFilter = value;
  }

  public fleetsUpdated(fleets: Array<string>) {
    this._fleetFilters.fleets = [];
    this._fleetFilters.fleets = fleets.map(m => m);
  }

  public typesUpdated(types: Array<string>) {
    this._fleetFilters.types = [];
    this._fleetFilters.types = types.map(m => m);
  }

  public brandsUpdated(brands: Array<string>) {
    this._fleetFilters.brands = [];
    this._fleetFilters.brands = brands.map(m => m);
  }

  public modelsUpdated(models: Array<string>) {
    this._fleetFilters.models = [];
    this._fleetFilters.models = models.map(m => m);
  }

  public statusesUpdated(statuses) {
    this._faultFilters.statuses = [];
    this._faultFilters.statuses = statuses.map(m => m);
  }

  public severitiesUpdated(severities) {
    this._faultFilters.severities = [];
    this._faultFilters.severities = severities.map(m => m);
  }

  public getFilterCount(): number {
    let count = 0;

    const { fleets, types, brands, models } = this.fleetFilters;

    if (fleets.length > 0) {
      count++;
    }

    if (types.length > 0) {
      count++;
    }

    if (brands.length > 0) {
      count++;
    }

    if (models.length > 0) {
      count++;
    }

    return count;
  }

  public getFaultFilterCount(): number {
    let _count = 0;

    const { severities, statuses } = this.faultFilters;

    if (severities.length > 0) {
      _count++;
    }

    if (statuses.length > 0) {
      _count++;
    }

    return _count;
  }

  public reset() {
    this._fleetFilters.fleets = [];
    this._fleetFilters.types = [];
    this._fleetFilters.brands = [];
    this._fleetFilters.models = [];

    this._selectedFilter = '';
  }

  public resetFaultFilters() {
    this._faultFilters.severities = [];
    this._faultFilters.statuses = [];
  }

  public updateFiltersAppliedCount() {
    const _routeParams = this._router.url.split('/');

    const _faultFiltercount =
      this.faultFilters.severities.length + this.faultFilters.statuses.length + 1;
    const _fleetFilterCount =
      this.fleetFilters.brands.length +
      this.fleetFilters.fleets.length +
      this.fleetFilters.models.length +
      this.fleetFilters.types.length;

    if (_routeParams.includes('faults')) {
      this.appliedFiltersCount$.next(_fleetFilterCount + _faultFiltercount);
    } else {
      this.appliedFiltersCount$.next(_fleetFilterCount);
    }
  }
}
