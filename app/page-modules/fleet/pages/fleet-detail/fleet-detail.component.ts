import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { of, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { FleetService } from '@fleet/services/fleet.service';
import { FleetVehicleInfoService } from '@fleet/services/fleet-vehicle-info.service';

export interface VehicleInfo {
  brand: string;
  company: string;
  isStatusClimateDisconnected: boolean;
  lastUpdate: string;
  model: string;
  name: string;
  parameters: any;
  pin: string;
  status: string;
  type: string;
}

@Component({
  selector: 'app-fleet-detail',
  templateUrl: './fleet-detail.component.html',
  styleUrls: ['./fleet-detail.component.css']
})
export class FleetDetailComponent implements OnInit {
  public vehicleInfo: VehicleInfo;
  public vehicleId: string;
  public lastUpdate: string;

  public loaded: boolean;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _vehicleInfoService: FleetVehicleInfoService,
    public fleetService: FleetService
  ) {}

  public ngOnInit(): void {
    this._activatedRoute.params
      .pipe(
        map(params => params['vehicleId'] as string),
        switchMap(id =>
          this._vehicleInfoService.getVehicleDataById(id).pipe(
            catchError(err => {
              if (err instanceof HttpErrorResponse) {
                if (err.status === 404) {
                  return of('VEHICLE_NOT_FOUND');
                }
              }

              return throwError(err);
            })
          )
        )
      )
      .subscribe(
        (data: any) => {
          if (data === 'VEHICLE_NOT_FOUND') {
            this._router.navigate(['/fleet/overview']);
          } else {
            this.vehicleInfo = this._vehicleInfoService.vehicleInfo;

            this.vehicleId = this._vehicleInfoService.vehicleId;
            this.lastUpdate = this._vehicleInfoService.lastUpdate;

            this.loaded = true;
          }
        },
        err => console.log(err)
      );
  }
}
