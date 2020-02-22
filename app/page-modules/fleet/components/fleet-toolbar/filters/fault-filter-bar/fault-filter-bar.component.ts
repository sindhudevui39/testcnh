import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { FaultsFilterDataService } from '@fleet/services/fleet-faults-filter-data/faults-filter-data.service';
import { FleetFilterService } from '@fleet/services/fleet-filter/fleet-filter.service';
@Component({
  selector: 'app-fault-filter-bar',
  templateUrl: './fault-filter-bar.component.html',
  styleUrls: ['./fault-filter-bar.component.css']
})
export class FaultFilterBarComponent implements OnInit {
  daysList;
  translatedFilterNames = {
    severityFiltername: '',
    statusFiltername: '',
    daysFilterName: ''
  };
  public severitiesList$;
  public statusesList$;

  constructor(
    private _faultDataStore: FaultsFilterDataService,
    private _fleetFilter: FleetFilterService,
    private _translateService: TranslateService
  ) {
    this._translateService
      .get([
        'PAGE_FAULTS.FILTER.WEEK',
        'PAGE_FAULTS.FILTER.MONTH',
        'PAGE_FAULTS.FILTER.MONTH_3',
        'PAGE_FAULTS.SEVERITY',
        'PAGE_FAULTS.FILTER.STATUS',
        'GLOBAL.DATETIME.DAY.PLURAL'
      ])
      .subscribe(res => {
        this._faultDataStore.daysFilterContent[0].name = res['PAGE_FAULTS.FILTER.WEEK'];
        this._faultDataStore.daysFilterContent[1].name = res['PAGE_FAULTS.FILTER.MONTH'];
        this._faultDataStore.daysFilterContent[2].name = res['PAGE_FAULTS.FILTER.MONTH_3'];
        this.translatedFilterNames.severityFiltername = res['PAGE_FAULTS.SEVERITY'];
        this.translatedFilterNames.statusFiltername = res['PAGE_FAULTS.FILTER.STATUS'];
        this.translatedFilterNames.daysFilterName = res['GLOBAL.DATETIME.DAY.PLURAL'];
        this.daysList = this._faultDataStore.daysFilterContent;
      });
  }

  ngOnInit() {
    this._faultDataStore.faultSeverities$.subscribe(data => {
      this.severitiesList$ = data;
    });
    this._faultDataStore.faultStatuses$.subscribe(data => {
      this.statusesList$ = data;
    });
  }

  applyFilters(selectedOptions: Array<string>, filterType: string): void {
    if (filterType.toUpperCase() === 'DAYS') {
      if (selectedOptions[0] === 'alreadychecked') {
        this._faultDataStore.onSelectionDateFilter(7);
      } else {
        const days = this._faultDataStore.daysFilterContent.filter(
          item => item.name === selectedOptions[0]
        )[0].days;

        this._faultDataStore.onSelectionDateFilter(days);
      }
    } else {
      switch (filterType) {
        case 'SEVERITIES':
          this._fleetFilter.severitiesUpdated(selectedOptions);

          break;
        case 'STATUSES':
          this._fleetFilter.statusesUpdated(selectedOptions);

          break;
      }

      this._fleetFilter.selectedFilter = filterType;
      this._faultDataStore.filterFaults();
    }
  }
}
