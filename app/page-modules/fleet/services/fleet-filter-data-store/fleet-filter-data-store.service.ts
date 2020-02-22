import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, forkJoin, timer } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';

import { ApiService } from '@services/api/api.service';
import { FleetFilterService, FilterModel } from '../fleet-filter/fleet-filter.service';
import { FleetFilterEventsService } from '../events/fleet-filter-events.service';
import { FleetHistroyNotificationService } from '@services/fleet-histroy-notification/fleet-histroy-notification.service';
import { FleetOverviewService } from '@fleet/pages/fleet-overview/services/fleet-overview-data/fleet-overview.service';
import { FleetVehicleInfoService } from '../fleet-vehicle-info.service';
import { FilterUtilService } from '@services/filter-util/filter-util.service';
import { PingService } from '@services/ping/ping.service';
import { UserService } from '@services/user/user.service';

import { FleetUrls } from '../fleet-api/fleet-urls.enum';

/**
 * !!!!!! IMPORTANT - DO NOT MODIFY !!!!!!
 *
 * PLEASE DO NOT MODIFY THE CODE IN THIS DATA STORE WITHOUT
 * CHECKING WITH THE OTHER DEVELOPERS. THIS DATA STORE ACTS
 * AS THE SINGLE SOURCE OF DATA FOR THE FILTERS IN FLEET, UNITS
 * IN FLEET-OVERVIEW, AND UNITS IN THE SIDE NAVIGATION PANE PRESENT
 * IN OVERVIEW AND FAULTS PAGE.
 */

interface FleetDropdownOptions {
  unitFleets: Array<FilterModel>;
  unitTypes: Array<FilterModel>;
  unitBrands: Array<FilterModel>;
  unitModels: Array<FilterModel>;
}

const FLEETS = 'FLEETS';
const TYPES = 'TYPES';
const BRANDS = 'BRANDS';
const MODELS = 'MODELS';

const MAP_ROUTE = '/fleet/overview/map';
const FAULT_ROUTE = '/fleet/faults/overview';

@Injectable({
  providedIn: 'root'
})
export class FleetFilterDataStoreService {
  private _refUnitsData = [];
  private _refMapUnitsData = [];
  private _filteredUnitsData: any[];
  private _searchString = '';

  public filteredUnitsData$ = new BehaviorSubject<Array<any>>(null);

  public unitFleets$ = new BehaviorSubject<Array<any>>(null);
  public unitTypes$ = new BehaviorSubject<Array<any>>(null);
  public unitBrands$ = new BehaviorSubject<Array<any>>(null);
  public unitModels$ = new BehaviorSubject<Array<any>>(null);

  public vehicleDataLoaded = false;

  public fleetCount$ = new BehaviorSubject<number>(0);
  public vehicleCount$ = new BehaviorSubject<number>(0);

  private _prevSelectedDropdown = true;

  constructor(
    private _http: HttpClient,
    private _router: Router,
    public _userService: UserService,
    private _apiService: ApiService,
    private _filterUtil: FilterUtilService,
    private _fleetFilter: FleetFilterService,
    private _filterEventsService: FleetFilterEventsService,
    private _fleetHistroyNotificationService: FleetHistroyNotificationService,
    private _fleetOverviewService: FleetOverviewService,
    private _vehicleInfoService: FleetVehicleInfoService,
    private _pingService: PingService
  ) {
    this._filterEventsService.searchValue$.subscribe(string => {
      if (string !== null) {
        this._searchString = string;
        this._prevSelectedDropdown = false;

        this.filterUnitsData();
      }
    });

    const units$ = this._http
      .get(FleetUrls.VEHICLE_DATA)
      .pipe(map(data => this._apiService.filterVehicleData(data['content'])));
    const urlNotificationType = this._userService.user['isDealer'] ? 'companies' : 'vehicles';
    const historyNotification$ = this._http
      .get(
        FleetUrls.USER_NOTIFICATIONS +
          '?userEmail=' +
          this._userService.user['email'] +
          '&type=' +
          urlNotificationType +
          '&tzOffset=' +
          new Date().getTimezoneOffset() +
          '&days=7&minSeverity=HIGH'
      )
      .pipe(map(data => data));

    const allowedParams$ = this._apiService.getAllowedParams();
    const userPreference$ = this._apiService.getFleetUserPreferences();

    timer(0, 60000)
      .pipe(
        switchMap(() => forkJoin(units$, historyNotification$, userPreference$, allowedParams$))
      )
      .subscribe((unitsData: Array<any>) => {
        if (this._vehicleInfoService.vehicleId) {
          this._vehicleInfoService.getVehicleDataById(this._vehicleInfoService.vehicleId);
        }

        this._fleetOverviewService.updatePanelData(unitsData[2], unitsData[3]);
        this._fleetHistroyNotificationService.updateRes(unitsData[1]);
        if (unitsData[0].length > 0) {
          const faults = this._fleetHistroyNotificationService.getUnitNotificationsCount(
            unitsData[1]
          );

          unitsData[0].forEach(vehicle => {
            let statusAlerts = 0;

            if (vehicle.id in faults) {
              statusAlerts = faults[vehicle.id].reduce((a: number, b: number) => a + b);
              vehicle['statusALERTS'] = statusAlerts;
            } else {
              vehicle['statusALERTS'] = statusAlerts;
            }
          });

          this._refUnitsData = unitsData[0];
          this._refMapUnitsData = unitsData[0].filter(
            f => f['location'] !== undefined && f['status'] !== undefined
          );
        } else {
          this._refUnitsData = [];
          this._refMapUnitsData = [];
        }

        if (!this.vehicleDataLoaded) {
          this.vehicleDataLoaded = true;
          this.initFleetDropdowns(true);
        } else {
          this.filterUnitsData();
        }

        this._pingService.unitsUpdated(this._refUnitsData);
      });

    this._fleetFilter.filterUpdated$.pipe(filter(updated => updated)).subscribe(() => {
      this._prevSelectedDropdown = true;
      this.filterUnitsData();
    });
  }

  public reset(): void {
    this._fleetFilter.reset();

    let data: Array<any>;

    if (this._router.url === MAP_ROUTE || this._router.url === FAULT_ROUTE) {
      data = this._refMapUnitsData.map(m => m);
    } else {
      data = this._refUnitsData.map(m => m);
    }

    this.filterBySearch(data);
  }

  public updateFleetData(): void {
    this.filterUnitsData();
  }

  private initFleetDropdowns(emit = false) {
    let data: Array<any>;

    if (this._router.url === MAP_ROUTE || this._router.url === FAULT_ROUTE) {
      data = this._refMapUnitsData.map(m => m);
    } else {
      data = this._refUnitsData.map(m => m);
    }

    const dropdownOptions: FleetDropdownOptions = {
      unitFleets: [],
      unitTypes: [],
      unitBrands: [],
      unitModels: []
    };

    data.forEach(unit => {
      dropdownOptions.unitFleets = this.setupDropdown(dropdownOptions.unitFleets, unit, FLEETS);
      dropdownOptions.unitTypes = this.setupDropdown(dropdownOptions.unitTypes, unit, TYPES);
      dropdownOptions.unitBrands = this.setupDropdown(dropdownOptions.unitBrands, unit, BRANDS);
      dropdownOptions.unitModels = this.setupDropdown(dropdownOptions.unitModels, unit, MODELS);
    });

    this.sortDropdownOptions(dropdownOptions);
    this.appendSelectAll(dropdownOptions);

    this.unitFleets$.next(dropdownOptions.unitFleets);
    this.unitTypes$.next(dropdownOptions.unitTypes);
    this.unitBrands$.next(dropdownOptions.unitBrands);
    this.unitModels$.next(dropdownOptions.unitModels);

    if (emit) {
      this.fleetCount$.next(dropdownOptions.unitFleets.length - 1);
      this.vehicleCount$.next(data.length);
      this.filteredUnitsData$.next(data);
    }
  }

  private filterUnitsData(): void {
    const { fleets, types, brands, models } = this._fleetFilter.fleetFilters;

    const expectedFilterCount = this._fleetFilter.getFilterCount();

    let data: Array<any>;

    if (this._router.url === MAP_ROUTE || this._router.url === FAULT_ROUTE) {
      data = this._refMapUnitsData.map(m => m);
    } else {
      data = this._refUnitsData.map(m => m);
    }

    const filteredData = data.filter(unit => {
      let fleetCount: number, typesCount: number, brandsCount: number, modelsCount: number;

      fleetCount = fleets.includes(unit['fleets'][0]['name']) ? 1 : 0;
      typesCount = types.includes(unit['type']['name']) ? 1 : 0;
      brandsCount = brands.includes(unit['brand']) ? 1 : 0;
      modelsCount = models.includes(unit['model']) ? 1 : 0;

      const actualFilterCount = fleetCount + typesCount + brandsCount + modelsCount;

      return actualFilterCount === expectedFilterCount;
    });

    this.filterBySearch(filteredData);
    this._fleetFilter.updateFiltersAppliedCount();
  }

  private filterBySearch(data: Array<any>): void {
    let filteredData = data;

    if (this._searchString !== '') {
      filteredData = data.filter(ele =>
        ele.name.toLowerCase().includes(this._searchString.toString().toLowerCase())
      );
    }

    this._filteredUnitsData = filteredData.map(m => m);

    this.updateDropdowns();

    this.filteredUnitsData$.next(filteredData);
  }

  private updateDropdowns(): void {
    const filterOptions = this.getAllDropdownItems();

    if (this._prevSelectedDropdown) {
      switch (this._fleetFilter.selectedFilter) {
        case 'FLEETS':
          this.unitTypes$.next(filterOptions.unitTypes);
          this.unitBrands$.next(filterOptions.unitBrands);
          this.unitModels$.next(filterOptions.unitModels);
          break;
        case 'TYPES':
          this.unitFleets$.next(filterOptions.unitFleets);
          this.unitBrands$.next(filterOptions.unitBrands);
          this.unitModels$.next(filterOptions.unitModels);
          break;
        case 'BRANDS':
          this.unitFleets$.next(filterOptions.unitFleets);
          this.unitTypes$.next(filterOptions.unitTypes);
          this.unitModels$.next(filterOptions.unitModels);
          break;
        case 'MODELS':
          this.unitFleets$.next(filterOptions.unitFleets);
          this.unitTypes$.next(filterOptions.unitTypes);
          this.unitBrands$.next(filterOptions.unitBrands);
          break;
        default:
          this.unitFleets$.next(filterOptions.unitFleets);
          this.unitTypes$.next(filterOptions.unitTypes);
          this.unitBrands$.next(filterOptions.unitBrands);
          this.unitModels$.next(filterOptions.unitModels);
          break;
      }
    } else {
      this.unitFleets$.next(filterOptions.unitFleets);
      this.unitTypes$.next(filterOptions.unitTypes);
      this.unitBrands$.next(filterOptions.unitBrands);
      this.unitModels$.next(filterOptions.unitModels);
    }

    this._prevSelectedDropdown = true;

    this.fleetCount$.next(filterOptions.unitFleets.length - 1);
    this.vehicleCount$.next(this._filteredUnitsData.length);
  }

  private getAllDropdownItems(): FleetDropdownOptions {
    const dropdownOptions: FleetDropdownOptions = {
      unitFleets: [],
      unitTypes: [],
      unitBrands: [],
      unitModels: []
    };

    const { fleets, types, brands, models } = this._fleetFilter.fleetFilters;

    let data: Array<any>;

    if (this._searchString) {
      data = this._filteredUnitsData;
    } else {
      if (this._router.url === MAP_ROUTE || this._router.url === FAULT_ROUTE) {
        data = this._refMapUnitsData.map(m => m);
      } else {
        data = this._refUnitsData.map(m => m);
      }
    }

    data
      .filter(unit => (types.length === 0 || types.includes(unit['type']['name']) ? true : false))
      .filter(unit => (brands.length === 0 || brands.includes(unit['brand']) ? true : false))
      .filter(unit => (models.length === 0 || models.includes(unit['model']) ? true : false))
      .forEach(unit => this.setupDropdown(dropdownOptions.unitFleets, unit, FLEETS));

    data
      .filter(unit =>
        fleets.length === 0 || fleets.includes(unit['fleets'][0]['name']) ? true : false
      )
      .filter(unit => (brands.length === 0 || brands.includes(unit['brand']) ? true : false))
      .filter(unit => (models.length === 0 || models.includes(unit['model']) ? true : false))
      .forEach(unit => this.setupDropdown(dropdownOptions.unitTypes, unit, TYPES));

    data
      .filter(unit =>
        fleets.length === 0 || fleets.includes(unit['fleets'][0]['name']) ? true : false
      )
      .filter(unit => (types.length === 0 || types.includes(unit['type']['name']) ? true : false))
      .filter(unit => (models.length === 0 || models.includes(unit['model']) ? true : false))
      .forEach(unit => this.setupDropdown(dropdownOptions.unitBrands, unit, BRANDS));

    data
      .filter(unit =>
        fleets.length === 0 || fleets.includes(unit['fleets'][0]['name']) ? true : false
      )
      .filter(unit => (types.length === 0 || types.includes(unit['type']['name']) ? true : false))
      .filter(unit => (brands.length === 0 || brands.includes(unit['brand']) ? true : false))
      .forEach(unit => this.setupDropdown(dropdownOptions.unitModels, unit, MODELS));

    this.sortDropdownOptions(dropdownOptions);
    this.appendSelectAll(dropdownOptions);

    return dropdownOptions;
  }

  private setupDropdown(
    arr: Array<FilterModel>,
    unit: any,
    dropdownType: string
  ): Array<FilterModel> {
    const dropdownItem: FilterModel = {
      id: '',
      name: '',
      checked: false
    };

    switch (dropdownType) {
      case 'FLEETS':
        if (!this._filterUtil.isValuePresent(arr, unit['fleets'][0]['name'])) {
          dropdownItem.name = unit['fleets'][0]['name'];
          dropdownItem.id = dropdownItem.name;
          dropdownItem.checked = this._fleetFilter.fleetFilters.fleets.includes(dropdownItem.name)
            ? true
            : false;
          arr.push(dropdownItem);
        }

        break;
      case 'TYPES':
        if (!this._filterUtil.isValuePresent(arr, unit['type']['name'])) {
          dropdownItem.name = unit['type']['name'];
          dropdownItem.id = dropdownItem.name;
          dropdownItem.checked = this._fleetFilter.fleetFilters.types.includes(dropdownItem.name)
            ? true
            : false;
          arr.push(dropdownItem);
        }

        break;
      case 'BRANDS':
        if (!this._filterUtil.isValuePresent(arr, unit['brand'])) {
          dropdownItem.name = unit['brand'];
          dropdownItem.id = dropdownItem.name;
          dropdownItem.checked = this._fleetFilter.fleetFilters.brands.includes(dropdownItem.name)
            ? true
            : false;
          arr.push(dropdownItem);
        }

        break;
      case 'MODELS':
        if (!this._filterUtil.isValuePresent(arr, unit['model'])) {
          dropdownItem.name = unit['model'];
          dropdownItem.id = dropdownItem.name;
          dropdownItem.checked = this._fleetFilter.fleetFilters.models.includes(dropdownItem.name)
            ? true
            : false;
          arr.push(dropdownItem);
        }

        break;
    }

    return arr;
  }

  private sortDropdownOptions(dropdownOptions: FleetDropdownOptions): FleetDropdownOptions {
    dropdownOptions.unitFleets.sort(this._filterUtil.sortDropdownArray);
    dropdownOptions.unitTypes.sort(this._filterUtil.sortDropdownArray);
    dropdownOptions.unitBrands.sort(this._filterUtil.sortDropdownArray);
    dropdownOptions.unitModels.sort(this._filterUtil.sortDropdownArray);

    return dropdownOptions;
  }

  private appendSelectAll(dropdownOptions: FleetDropdownOptions): FleetDropdownOptions {
    const item: FilterModel = {
      id: 'Select All',
      name: 'Select All',
      checked: false
    };

    dropdownOptions.unitFleets.unshift(Object.assign({}, item));
    dropdownOptions.unitTypes.unshift(Object.assign({}, item));
    dropdownOptions.unitBrands.unshift(Object.assign({}, item));
    dropdownOptions.unitModels.unshift(Object.assign({}, item));

    return dropdownOptions;
  }
}
