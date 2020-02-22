import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, tap, switchMap, map, concatMap, mergeMap } from 'rxjs/operators';

import { ApiService } from '@services/api/api.service';
import { FleetFilterDataStoreService } from '@fleet/services/fleet-filter-data-store/fleet-filter-data-store.service';
import { FleetService } from '@fleet/services/fleet.service';
import { BehaviorSubject } from 'rxjs';

interface DisplayData {
  fleetCount: number;
  pin: string;
  showClimateIcon: boolean;
  vehicleBrand: string;
  vehicleCount: number;
  vehicleModel: string;
  vehicleName: string;
}
@Component({
  selector: 'app-fleet-toolbar-display-info',
  templateUrl: './fleet-toolbar-display-info.component.html',
  styleUrls: ['./fleet-toolbar-display-info.component.css']
})
export class FleetToolbarDisplayInfoComponent implements OnInit {
  public showCounts: boolean;
  public dataLoaded = false;

  private displayData: DisplayData = {
    fleetCount: 0,
    pin: '',
    showClimateIcon: false,
    vehicleBrand: '',
    vehicleCount: 0,
    vehicleModel: '',
    vehicleName: ''
  };

  private _displayCount$ = new BehaviorSubject<boolean>(false);

  constructor(
    private _router: Router,
    private _apiService: ApiService,
    private _fleetDataStore: FleetFilterDataStoreService,
    private _fleetService: FleetService
  ) {}

  ngOnInit() {
    this._router.events
      .pipe(
        filter(event => event instanceof NavigationEnd && !this.isMapRoute()),
        tap(() => (this.dataLoaded = false))
      )
      .subscribe(event => {
        this.infoToBeDisplayed(event['url']);
      });

    // For Maps - Since Url Doesn't Contain Vehicle Id
    this._fleetService.clickedId$
      .pipe(
        filter(id => this.isMapRoute()),
        tap(id => (this.dataLoaded = false))
      )
      .subscribe(vehicleId => {
        this.displayLogicForMaps(vehicleId);
      });

    this._displayCount$
      .pipe(
        filter(val => val),
        switchMap(() =>
          this._fleetDataStore.fleetCount$.pipe(
            mergeMap(fleetCount =>
              this._fleetDataStore.vehicleCount$.pipe(
                map(vehicleCount => [fleetCount, vehicleCount])
              )
            )
          )
        )
      )
      .subscribe(counts => {
        if (!this._router.url.split('/').includes('detail') || this.isMapRoute()) {
          this._fleetService.clickedId$.subscribe(id => {
            if (!id) {
              this.displayData.fleetCount = counts[0];
              this.displayData.vehicleCount = counts[1];

              this.dataLoaded = true;
              this.showCounts = true;
            }
          });
        }
      });

    this.infoToBeDisplayed(this._router.url);
  }

  infoToBeDisplayed(route) {
    const _route = route.split('/');

    if (_route.includes('detail')) {
      const id = _route.pop();

      this.getVehicleDataById(id);

      this.showCounts = false;
    } else {
      this._displayCount$.next(true);
    }
  }

  displayLogicForMaps(vehicleId) {
    if (vehicleId) {
      this.getVehicleDataById(vehicleId);
      this.showCounts = false;
    } else {
      this._displayCount$.next(true);
    }
  }

  getVehicleDataById(id) {
    this._apiService.getVehicleDataById(id).subscribe(data => {
      this.displayData.vehicleName = data['name'];
      this.displayData.vehicleBrand = data['brand'];
      this.displayData.vehicleModel = data['model'];
      this.displayData.pin = data['serialNumber'];

      this.displayData.showClimateIcon = this.isDeviceTypeCFV(data['capabilities']);

      this.dataLoaded = true;
    });
  }

  isDeviceTypeCFV(capabilities) {
    if (
      capabilities &&
      Object.keys(capabilities).length > 0 &&
      capabilities.deviceType.toLowerCase() === 'cfv'
    ) {
      return true;
    }

    return false;
  }

  private isMapRoute(): boolean {
    return this._router.url.split('/').includes('map');
  }
}
