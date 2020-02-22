import { Component, OnInit } from '@angular/core';
import { FleetService } from '@fleet/services/fleet.service';
import { FaultsFilterDataService } from '@fleet/services/fleet-faults-filter-data/faults-filter-data.service';

@Component({
  selector: 'app-fleet-fault-overview',
  templateUrl: './fleet-fault-overview.component.html',
  styleUrls: ['./fleet-fault-overview.component.css']
})
export class FleetFaultOverviewComponent implements OnInit {
  public _dataSource: any;
  dataLoaded = false;
  _noData = false;

  constructor(
    private fleetService: FleetService,
    private faultFilterDataService: FaultsFilterDataService
  ) {
    this.faultFilterDataService.filteredFaultsData$.subscribe(data => {
      if (data === 'fetching_data') {
        this.dataLoaded = false;
      } else if (data && data.length > 0) {
        this._dataSource = this.fleetService.setupFaultsData(data);

        this._noData = false;
        this.dataLoaded = true;
      } else {
        this._dataSource = [];

        this._noData = true;
        this.dataLoaded = true;
      }
    });
  }

  ngOnInit() {
    this.dataLoaded = false;

    this.faultFilterDataService.getAllFaultsByDays();
  }
}
