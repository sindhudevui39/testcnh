import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import {
  FleetFilterService,
  FilterModel,
  FaultFilters
} from '../fleet-filter/fleet-filter.service';
import { FleetService } from '../fleet.service';
import { UtilService } from '@services/util/util.service';

import { FleetUrls } from '../fleet-api/fleet-urls.enum';

interface FaultsDropdownOptions {
  severities: Array<FilterModel>;
  statuses: Array<FilterModel>;
}

const dropdownOptions: FaultsDropdownOptions = {
  severities: [
    { id: 'Select All', checked: false },
    { id: 'high' },
    { id: 'medium' },
    { id: 'low' }
  ],
  statuses: [{ id: 'Select All' }, { id: 'active' }, { id: 'inactive' }]
};

@Injectable({
  providedIn: 'root'
})
export class FaultsFilterDataService {
  _refFaultsData: any;
  selectedVehicleID: string;
  _date: string;
  unitFaults = false;
  _selectAllTranslated: string;
  _prevoiusSelectedSeveritiesFilters: Array<string>;
  _prevoiusSelectedStatusFilters: Array<string>;

  public filteredFaultsData$ = new BehaviorSubject<any>(null);
  public filteredUnitFaultsData$ = new BehaviorSubject<any>(null);

  public faultStatuses$ = new BehaviorSubject<Array<any>>(null);
  public faultSeverities$ = new BehaviorSubject<Array<any>>(null);

  public resetClicked$ = new BehaviorSubject<boolean>(false);

  public daysFilterContent = [
    { id: 'Last 7 Days', name: 'Last 7 Days', checked: true, days: 7 },
    { id: 'Last 30 Days', name: 'Last 30 Days', checked: false, days: 30 },
    { id: 'Last 90 Days', name: 'Last 90 Days', checked: false, days: 90 }
  ];

  private _unitfaults: any;
  private _allFaults: any;
  private unitsFaultsDataPending = false;
  private allFaultsDataPending = false;

  private _severityFilterContentTranslations = {
    high: '',
    low: '',
    medium: ''
  };
  private _statusFilterContentTranslations = {
    active: '',
    inactive: ''
  };

  constructor(
    private http: HttpClient,
    private _fleetFilterService: FleetFilterService,
    private utilservice: UtilService,
    private fleetService: FleetService
  ) {
    this._date = this.utilservice.getCurrentISOTime(7).substring(0, 10);
  }

  setTranslations(value) {
    this._selectAllTranslated = value['GLOBAL.SELECT_ALL'];
    this._statusFilterContentTranslations.active = value['PAGE_FAULTS.FILTER.ACTIVE'];
    this._statusFilterContentTranslations.inactive = value['PAGE_FAULTS.FILTER.INACTIVE'];
    this._severityFilterContentTranslations.high = value['PAGE_MAIN.ALERTS.SEVERITIES.HIGH'];
    this._severityFilterContentTranslations.low = value['PAGE_MAIN.ALERTS.SEVERITIES.LOW'];
    this._severityFilterContentTranslations.medium = value['PAGE_MAIN.ALERTS.SEVERITIES.MEDIUM'];
  }

  onSelectionDateFilter(numOfDays) {
    this._date = this.utilservice.getCurrentISOTime(numOfDays).substring(0, 10);

    this.daysFilterContent.forEach(item => {
      item.checked = item.days === numOfDays ? true : false;
    });

    if (this.unitFaults) {
      this.filteredUnitFaultsData$.next('fetching_data');

      this.getUnitFaults();
    } else {
      this.filteredFaultsData$.next('fetching_data');

      this.getAllFaultsByDays();
    }
  }

  getUnitFaults(id?: string) {
    this.unitFaults = true;

    this._fleetFilterService.selectedFilter = undefined;

    this.unitFaults = true;
    if (this.unitsFaultsDataPending) {
      this._unitfaults.unsubscribe();
    }
    if (this.allFaultsDataPending) {
      this._allFaults.unsubscribe();
    }

    this.fleetService.clickedId$.subscribe(vId => {
      this.selectedVehicleID = vId.toString();
    });

    this.unitsFaultsDataPending = true;

    const url = `${FleetUrls.FLEET_FAULTS_BY_ID}?id=${this.selectedVehicleID}&date=${this._date}`;
    this._unitfaults = this.http
      .get(url)
      .pipe(
        tap(data => {
          if (data) {
            this._refFaultsData = data['content'];
            this.filterFaults('newData');
          }
        })
      )
      .subscribe(
        () => {
          this.unitsFaultsDataPending = false;
        },
        err => {
          console.log(err);
        }
      );
  }

  getAllFaultsByDays() {
    this.unitFaults = false;

    this._fleetFilterService.selectedFilter = undefined;

    if (this.allFaultsDataPending) {
      this._allFaults.unsubscribe();
    }
    if (this.unitsFaultsDataPending) {
      this._unitfaults.unsubscribe();
    }

    this.allFaultsDataPending = true;

    const _url = `${FleetUrls.FLEET_ALL_FAULTS_DETAILS}?date=${this._date}`;

    this._allFaults = this.http
      .get(_url)
      .pipe(
        tap(data => {
          if (data) {
            this._refFaultsData = data['content'];

            this.filterFaults('newData');
          }
        })
      )
      .subscribe(() => {
        this.allFaultsDataPending = false;
      });
  }

  public filterFaults(cId?: string) {
    const _severities = dropdownOptions.severities;
    const _statuses = dropdownOptions.statuses;

    const severities = this._fleetFilterService.faultFilters.severities;
    const statuses = this._fleetFilterService.faultFilters.statuses;

    const _availableSeverities = [];
    const _availableStatuses = [];

    let filteredFaults = null;
    if (this._refFaultsData) {
      // Filter Faults Data
      const expectedFilterCount = this._fleetFilterService.getFaultFilterCount();

      filteredFaults = this._refFaultsData.filter(fault => {
        let severitiesCount: number, statusesCount: number;

        const status = fault.active ? 'active' : 'inactive';

        severitiesCount = severities.includes(
          this._severityFilterContentTranslations[fault.severity.toLowerCase()]
        )
          ? 1
          : 0;
        statusesCount = statuses.includes(this._statusFilterContentTranslations[status]) ? 1 : 0;

        const actualFilterCount = severitiesCount + statusesCount;

        return actualFilterCount === expectedFilterCount ? true : false;
      });

      if (filteredFaults.length === 0) {
        filteredFaults = null;
      }

      // Update the available filter option values from the data
      this._refFaultsData.forEach(fault => {
        const _status = this._statusFilterContentTranslations[fault.active ? 'active' : 'inactive'];
        const _severity = this._severityFilterContentTranslations[fault.severity.toLowerCase()];

        if (_availableSeverities.indexOf(_severity) < 0) {
          _availableSeverities.push(_severity);
        }
        if (_availableStatuses.indexOf(_status) < 0) {
          _availableStatuses.push(_status);
        }
      });
    }

    // Setup Dropdowns
    _severities.forEach(severityItem => {
      if (severityItem.id === 'Select All') {
        severityItem.name = this._selectAllTranslated;
      } else {
        severityItem.name = this._severityFilterContentTranslations[severityItem.id];
      }
      severityItem.checked = severities.indexOf(severityItem.name) >= 0 ? true : false;
      severityItem.disabled = this.isDisableItem(
        _availableSeverities,
        severityItem,
        this._prevoiusSelectedSeveritiesFilters,
        cId
      );
    });
    _statuses.forEach(statusItem => {
      if (statusItem.id === 'Select All') {
        statusItem.name = this._selectAllTranslated;
      } else {
        statusItem.name = this._statusFilterContentTranslations[statusItem.id];
      }
      statusItem.checked = statuses.indexOf(statusItem.name) >= 0 ? true : false;
      statusItem.disabled = this.isDisableItem(
        _availableStatuses,
        statusItem,
        this._prevoiusSelectedStatusFilters,
        cId
      );
    });

    // Update selectAll
    _severities[0].checked =
      _severities.filter((item, i) => i > 0 && item.checked === true).length === 3 ? true : false;

    _statuses[0].checked =
      _statuses.filter((item, i) => i > 0 && item.checked === true).length === 2 ? true : false;

    _severities[0].disabled =
      _severities.filter((item, i) => i > 0 && item.disabled === true).length > 0 ? true : false;

    _statuses[0].disabled =
      _statuses.filter((item, i) => i > 0 && item.disabled === true).length > 0 ? true : false;

    this.faultStatuses$.next(_statuses);
    this.faultSeverities$.next(_severities);
    if (this.unitFaults) {
      this.filteredUnitFaultsData$.next(filteredFaults);
    } else {
      this.filteredFaultsData$.next(filteredFaults);
    }

    if (this._refFaultsData || cId === 'newData') {
      this._prevoiusSelectedSeveritiesFilters = severities.slice();
      this._prevoiusSelectedStatusFilters = statuses.slice();
    }

    this._fleetFilterService.updateFiltersAppliedCount();
  }

  isDisableItem(availableContent, item, prevSelectedValues: Array<string>, cId) {
    if (item.checked === true) {
      return false;
    } else {
      if (availableContent.indexOf(item.name) >= 0) {
        return false;
      }
      if (prevSelectedValues && prevSelectedValues.indexOf(item.name) >= 0) {
        if (cId && cId === 'newData') {
          return true;
        }
        return false;
      }
      return true;
    }
  }

  resetFaultFilters(): void {
    this.faultSeverities$.next(null);
    this.faultStatuses$.next(null);
    this._fleetFilterService.resetFaultFilters();
    this._date = this.utilservice.getCurrentISOTime(7).substring(0, 10);

    this.resetDaysDD();

    if (this.unitFaults) {
      this.filteredUnitFaultsData$.next('fetching_data');
      this.getUnitFaults();
    } else {
      this.filteredFaultsData$.next('fetching_data');
      this.getAllFaultsByDays();
    }

    this.resetClicked$.next(true);
  }
  public resetDaysDD() {
    this.daysFilterContent.forEach(item => {
      item.checked = item.id === 'Last 7 Days' ? true : false;
    });
  }

  getDateForSelectedDays() {
    return this._date;
  }
}
