import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subscription } from 'rxjs';

import { AppSettingsService } from '@services/app-settings/app-settings.service';
import { FleetFilterDataStoreService } from '@fleet/services/fleet-filter-data-store/fleet-filter-data-store.service';
import { FleetFilterEventsService } from '@fleet/services/events/fleet-filter-events.service';
import { FleetOverviewService } from '@fleet/pages/fleet-overview/services/fleet-overview-data/fleet-overview.service';
import { FleetOverviewSortService } from './services/fleet-overview-sort/fleet-overview-sort.service';
import { FleetUtilService } from '@fleet/services/fleet-util/fleet-util.service';
import { RemoteDisplayService } from '@remote-display/services/remote-display/remote-display.service';
import { ToolbarToggleFilterbarService } from '@fleet/services/events/toolbar-toggle-filterbar.service';

@Component({
  selector: 'app-fleet-overview',
  templateUrl: './fleet-overview.component.html',
  styleUrls: ['./fleet-overview.component.css'],
  animations: [
    trigger('collapseVehicles', [
      state(
        'collapsed',
        style({
          height: '0',
          minHeight: '0',
          display: 'none',
          overflow: 'hidden'
        })
      ),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('350ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class FleetOverviewComponent implements OnInit, OnDestroy {
  private _rdvInitiatedSubscription: Subscription;
  private _rdvEnabledView: Subscription;
  public filtersBarOpen: boolean;
  public dataLoaded = false;
  public displayRDVOption = false;
  public showNoDataText = false;
  public highlightValue: string;
  private _refData: any;
  public overviewData: any;
  public disableRemoteDisplay: boolean;
  public collapseState: any;
  rdvStatusMsg: string;

  constructor(
    private fleetFilterDataStore: FleetFilterDataStoreService,
    public fleetUtilService: FleetUtilService,
    private fleetOverviewService: FleetOverviewService,
    private toggleFilterBarService: ToolbarToggleFilterbarService,
    private _filterEventsService: FleetFilterEventsService,
    private _remoteDisplay: RemoteDisplayService,
    private _appSettings: AppSettingsService,
    private overviewsort: FleetOverviewSortService
  ) {
    this.toggleFilterBarService.openFiltersBar$.subscribe(value => {
      this.filtersBarOpen = value;
    });
  }

  ngOnInit() {
    this._filterEventsService.searchValue$.subscribe(value => (this.highlightValue = value));

    this._rdvInitiatedSubscription = this._remoteDisplay.rdvInitiated$.subscribe(initiated => {
      if (initiated) {
        this.disableRemoteDisplay = true;
      } else {
        this.disableRemoteDisplay = false;
      }
    });

    this._rdvEnabledView = this._remoteDisplay.enableRemoteDisplayView$.subscribe(data => {
      if (data) {
        if (data.enable) {
          this.rdvStatusMsg = data.socketResponse.connectionStatus;
        }
      }
    });

    this.initiateCalls();

    this.fleetOverviewService.collapseState$.subscribe(collapseState => {
      if (collapseState) {
        this.collapseState = collapseState;
      }
    });

    if (this._appSettings.rdvSettings.enableRdv) {
      this.displayRDVOption = true;
    } else {
      this.displayRDVOption = false;
    }
  }

  ngOnDestroy() {
    this._rdvInitiatedSubscription.unsubscribe();
    this._rdvEnabledView.unsubscribe();
  }

  initiateCalls() {
    this.fleetFilterDataStore.filteredUnitsData$.subscribe(
      fData => {
        if (this.fleetFilterDataStore.vehicleDataLoaded) {
          if (fData && fData.length > 0) {
            this._refData = fData;

            this.overviewData = this.fleetOverviewService.getFormattedOverviewData(this._refData);
            this.overviewsort.setRefData(this.overviewData);

            if (!this.dataLoaded) {
              this.fleetOverviewService.setCollapseStateFalse();
            }

            this.dataLoaded = true;
            this.showNoDataText = false;
          } else if (fData.length === 0) {
            this.overviewData = {};
            this.dataLoaded = true;
            this.showNoDataText = true;
          }
        }
      },
      err => console.log(err)
    );
  }

  changeCollapseState(key) {
    this.fleetOverviewService.changeCollapseState(key);
  }

  onCustomParamsChange(value) {
    if (!value) {
      this.dataLoaded = false;
    } else {
      this.initiateCalls();
    }
  }
}
