import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';

import { FaultsFilterDataService } from '@fleet/services/fleet-faults-filter-data/faults-filter-data.service';
import { FleetFilterDataStoreService } from '@fleet/services/fleet-filter-data-store/fleet-filter-data-store.service';
import { FleetFilterEventsService } from '@fleet/services/events/fleet-filter-events.service';
import { NavmapService } from '@fleet/services/navmap.service';
import { ToolbarToggleFilterbarService } from '@fleet/services/events/toolbar-toggle-filterbar.service';
import { UserService } from '@services/user/user.service';
import { FleetFirmwareComponent } from '@fleet/pages/fleet-firmware/fleet-firmware.component';
import { MatDialog } from '@angular/material';
import { FleetFilterService } from '@fleet/services/fleet-filter/fleet-filter.service';

import { BrandNames } from '@enums/brand.enum';
import { FleetService } from '@fleet/services/fleet.service';
import { FotaService } from '@fleet/pages/fleet-firmware/services/fota/fota.service';

@Component({
  selector: 'app-fleet-toolbar',
  templateUrl: './fleet-toolbar.component.html',
  styleUrls: ['./fleet-toolbar.component.css']
})
export class FleetToolbarComponent implements OnInit {
  public brands = BrandNames;
  displayFilter = false;
  selected: any = 'list';
  filtersAppliedCount: number;
  public searchValue: string;
  isDealer = false;

  constructor(
    private _fleetDataStore: FleetFilterDataStoreService,
    private _filterEventsService: FleetFilterEventsService,
    private _toggleFilterBar: ToolbarToggleFilterbarService,
    private _router: Router,
    private _faultsDataStore: FaultsFilterDataService,
    private _fleetFilter: FleetFilterService,
    public userService: UserService,
    public navMapService: NavmapService,
    public dialog: MatDialog,
    public fleetService: FleetService,
    private fotaService: FotaService
  ) {}

  ngOnInit() {
    this.isDealer = this.userService.getUser().isDealer ? true : false;

    this._toggleFilterBar.openFiltersBar$.subscribe(value => {
      if (value) {
        this.displayFilter = true;
      }
    });

    this._filterEventsService.searchValue$.subscribe(
      searchValue => (this.searchValue = searchValue)
    );

    this._toggleFilterBar.updateOpenFiltersBar(this.displayFilter);

    if (this._router.url === '/fleet/overview' || this._router.url === '/fleet/overview/map') {
      this.navMapService.showMap = true;
      this.navMapService.selectedOption = 'list';
    }

    this._fleetFilter.appliedFiltersCount$.subscribe(count => {
      this.filtersAppliedCount = count;
    });
    if (this._router.url.split('/')[2] === 'detail') {
      this.fleetService.getCanFeature();
    }
  }

  toggleChange($event) {
    if ($event.value === 'map') {
      this.selected = 'map';
      this._router.navigate(['/fleet/overview/map']);
    } else if ($event.value === 'list') {
      this.selected = 'list';
      this._router.navigate(['/fleet/overview']);
    }
  }
  toggleChangeCanFeature($event) {
    if ($event.value === 'details') {
      this.fleetService.selectedOption = 'details';
    } else if ($event.value === 'canData') {
      this.fleetService.selectedOption = 'canData';
    }
  }
  public toggleFilter() {
    this.displayFilter = !this.displayFilter;

    this._toggleFilterBar.updateOpenFiltersBar(this.displayFilter);
  }
  public onseachValueChange(value) {
    this._filterEventsService.updateSearchValue(value);
  }
  public resetFilters() {
    this._fleetDataStore.reset();

    if (this._router.url.split('/')[2] === 'faults') {
      this._faultsDataStore.resetFaultFilters();
    }
  }

  public showFaultsBar(): boolean {
    if (this._router.url.split('/')[2] === 'faults') {
      return true;
    }

    return false;
  }

  FOTADeviceNotification() {
    const dialogRef = this.dialog.open(FleetFirmwareComponent, {
      width: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
      height: '100%'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.fotaService.reset();
    });
  }
}
