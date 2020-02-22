import { Component, OnInit, OnDestroy } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { FleetService } from '../../services/fleet.service';
import { ToolbarToggleFilterbarService } from '@fleet/services/events/toolbar-toggle-filterbar.service';
import { FaultsFilterDataService } from '@fleet/services/fleet-faults-filter-data/faults-filter-data.service';
import { FleetFilterService } from '@fleet/services/fleet-filter/fleet-filter.service';

@Component({
  selector: 'app-fleet-faults',
  templateUrl: './fleet-faults.component.html',
  styleUrls: ['./fleet-faults.component.css']
})
export class FleetFaultsComponent implements OnInit, OnDestroy {
  filtersBarOpen: boolean;
  elementCount;
  paginationOpts: any;

  constructor(
    private fleetService: FleetService,
    toggleFilterBarService: ToolbarToggleFilterbarService,
    private _translateService: TranslateService,
    private _faultDataStore: FaultsFilterDataService,
    private _fleetFilterService: FleetFilterService
  ) {
    toggleFilterBarService.openFiltersBar$.subscribe(value => {
      this.filtersBarOpen = value;
    });
  }

  ngOnInit() {
    this._translateService
      .get([
        'GLOBAL.SELECT_ALL',
        'PAGE_FAULTS.FILTER.ACTIVE',
        'PAGE_FAULTS.FILTER.INACTIVE',
        'PAGE_MAIN.ALERTS.SEVERITIES.HIGH',
        'PAGE_MAIN.ALERTS.SEVERITIES.LOW',
        'PAGE_MAIN.ALERTS.SEVERITIES.MEDIUM'
      ])
      .subscribe(res => {
        this._faultDataStore.setTranslations(res);
      });
    this.fleetService.elementCount$.subscribe(id => {
      this.elementCount = id;

      this.paginationOpts = {
        lowerElement: 1,
        higherElement: id,
        totalElements: id
      };
    });
  }

  ngOnDestroy() {
    this.fleetService.selectedOrder = true;
    this.fleetService.selectedAttr = 'date';
  }
}
