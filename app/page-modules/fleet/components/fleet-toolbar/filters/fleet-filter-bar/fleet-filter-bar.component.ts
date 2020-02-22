import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { FleetFilterDataStoreService } from '../../../../services/fleet-filter-data-store/fleet-filter-data-store.service';
import { FleetFilterService } from '../../../../services/fleet-filter/fleet-filter.service';

@Component({
  selector: 'app-fleet-filter-bar',
  templateUrl: './fleet-filter-bar.component.html',
  styleUrls: ['./fleet-filter-bar.component.css']
})
export class FleetFilterBarComponent implements OnInit {
  public fleetList$;
  public typesList$;
  public brandsList$;
  public modelsList$;

  private _translatedSelectAll: string;
  translatedDropdownNames = {
    brandFilterName: '',
    fleetFilterName: '',
    ModelFilterName: '',
    typeFilterName: ''
  };

  constructor(
    private _translateService: TranslateService,
    private _fleetDataStore: FleetFilterDataStoreService,
    private _fleetFilter: FleetFilterService
  ) {
    this._translateService
      .get([
        'GLOBAL.SELECT_ALL',
        'GLOBAL.BRAND.SINGULAR',
        'GLOBAL.FLEET.SINGULAR',
        'PAGE_FAULTS.MODEL',
        'PAGE_VEHICLE_DETAILS.TYPE'
      ])
      .subscribe(data => {
        this.translatedDropdownNames.brandFilterName = data['GLOBAL.BRAND.SINGULAR'];
        this.translatedDropdownNames.fleetFilterName = data['GLOBAL.FLEET.SINGULAR'];
        this.translatedDropdownNames.ModelFilterName = data['PAGE_FAULTS.MODEL'];
        this.translatedDropdownNames.typeFilterName = data['PAGE_VEHICLE_DETAILS.TYPE'];
      });
  }

  ngOnInit() {
    this.fleetList$ = this._fleetDataStore.unitFleets$.pipe(
      filter(data => data !== null)
      // map(data => this.translateDropdown(data))
    );
    this.typesList$ = this._fleetDataStore.unitTypes$.pipe(
      filter(data => data !== null)
      // map(data => this.translateDropdown(data))
    );
    this.brandsList$ = this._fleetDataStore.unitBrands$.pipe(
      filter(data => data !== null)
      // map(data => this.translateDropdown(data))
    );
    this.modelsList$ = this._fleetDataStore.unitModels$.pipe(
      filter(data => data !== null)
      // map(data => this.translateDropdown(data))
    );
  }

  /**
   * Stores the latest selected filter options.
   * Emits event to filter the data.
   * @param selectedOptions List of selected filter options for the current dropdown.
   * @param filterType Current dropdown name.
   */
  applyFilters(selectedOptions: Array<string>, filterType: string): void {
    switch (filterType) {
      case 'FLEETS':
        this._fleetFilter.fleetsUpdated(selectedOptions);
        break;
      case 'TYPES':
        this._fleetFilter.typesUpdated(selectedOptions);
        break;
      case 'BRANDS':
        this._fleetFilter.brandsUpdated(selectedOptions);
        break;
      case 'MODELS':
        this._fleetFilter.modelsUpdated(selectedOptions);
        break;
    }

    this._fleetFilter.selectedFilter = filterType;
    this._fleetFilter.filterUpdated$.next(true);
  }

  private translateDropdown(data) {
    const updatedDropdown = [...data];
    updatedDropdown[0].name = this._translatedSelectAll;

    return updatedDropdown;
  }
}
