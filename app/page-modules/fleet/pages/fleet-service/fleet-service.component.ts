import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '@services/api/api.service';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { FleetService } from '@fleet/services/fleet.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-fleet-service',
  templateUrl: './fleet-service.component.html',
  styleUrls: ['./fleet-service.component.css']
})
export class FleetServiceComponent implements OnInit {
  vehicleList = [];
  faultSource = [];
  @Input()
  vehicleId;
  @Input()
  datasrc;
  dataSource;
  fleetCount = [];
  vehicleCount = [];
  pathId;
  constructor(
    private apiService: ApiService,
    private _router: Router,
    private fleetService: FleetService
  ) {
    this._router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe(event => {
      if (event['url'].split('/')[2] === 'service') {
        this.pathId = event['url'].split('/')[3];
        if (this.pathId === undefined) {
          this.pathId = '';
        }
        // this.showLoader = true;
        // this.showFaults = true;
        // this.showAllFaults = false;

        // this.apiService.getUnitFaults(this.pathId).subscribe(
        //   response => {
        //     if (response['content']) {
        //       this.showLoader = false;
        //       this.noData = false;
        //     } else {
        //       this.showLoader = false;
        //       this.noData = true;
        //     }
        //     this.dataSource = response;
        //     this.fleetService._faultData.next(this.dataSource);
        //     this.fleetService.importData = response;
        //   },
        //   err => {
        //     if (err.status === 500) {
        //       this.showFaults = false;
        //       this.showLoader = false;
        //       this.noData = true;
        //     }
        //   }
        // );
      }
    });
  }

  ngOnInit() {
    this.apiService.getVehicleData().subscribe(response => {
      response.forEach(element => {
        this.vehicleList.push(element);
      });
    });
  }
  // idReceived(id) {
  //   this.apiService.getUnitFaults(id).subscribe(response => {
  //     const source = response['content'];
  //     source.sort((a, b) => this.sortFunc(a.created, b.created));
  //     source.forEach(element =>
  //       this.faultSource.push({
  //         element: false
  //       })
  //     );

  //     this.dataSource = source;
  //   });
  // }
  // sortFunc(a, b) {
  //   if (a < b) {
  //     return -1;
  //   }

  //   if (a > b) {
  //     return 1;
  //   }

  //   return 0;
  // }
}
