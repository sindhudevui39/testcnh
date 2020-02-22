import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { FleetService } from '@fleet/services/fleet.service';
import { FaultsFilterDataService } from '@fleet/services/fleet-faults-filter-data/faults-filter-data.service';

@Component({
  selector: 'app-fleet-fault-list',
  templateUrl: './fleet-fault-list.component.html',
  styleUrls: ['./fleet-fault-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class FleetFaultListComponent implements OnInit, OnDestroy {
  private _id;
  private _sub: any;
  private _dataSource: any;
  dataLoaded = false;
  noData = false;
  constructor(
    private _route: ActivatedRoute,
    private faultsFilterDataService: FaultsFilterDataService,
    private fleetService: FleetService
  ) {
    this.faultsFilterDataService.filteredUnitFaultsData$.subscribe(data => {
      if (data === 'fetching_data') {
        this.dataLoaded = false;
      } else if (data) {
        this.dataLoaded = true;
        this.noData = false;

        this._dataSource = this.fleetService.setupFaultsData(data);

        this.fleetService._elementCount.next(this._dataSource['length']);
      }
      if (!data) {
        this.dataLoaded = true;
        this.noData = true;

        this.fleetService._elementCount.next(0);
      }
    });
  }

  ngOnInit() {
    this.dataLoaded = false;
    this.noData = false;

    this._sub = this._route.params.subscribe(params => {
      this.dataLoaded = false;
      this.noData = false;

      this._id = params['vehicleId'];

      this.fleetService._clickedId.next(this._id);

      this.faultsFilterDataService.getUnitFaults();
    });
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }
}
