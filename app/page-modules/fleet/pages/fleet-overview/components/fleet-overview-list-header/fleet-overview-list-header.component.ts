import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

import { ApiService } from '@services/api/api.service';
import { FleetOverviewSortService } from '../../services/fleet-overview-sort/fleet-overview-sort.service';
import { FleetOverviewService } from '../../services/fleet-overview-data/fleet-overview.service';

import { VehicleCustomizationComponent } from '../../vehicle-customization-modal/vehicle-customization-component';

@Component({
  selector: 'app-fleet-overview-list-header',
  templateUrl: './fleet-overview-list-header.component.html',
  styleUrls: ['./fleet-overview-list-header.component.css']
})
export class FleetOverviewListHeaderComponent implements OnInit {
  @Output() customParamsChange = new EventEmitter();
  custom2Changed: boolean;
  custom1Changed: boolean;
  isAsc = true;
  selectedSortItem: string;
  param1 = {
    index: 1
  };
  param2 = {
    index: 2
  };
  public disableRemoteDisplay: boolean;

  constructor(
    private _dialog: MatDialog,
    private overviewSortService: FleetOverviewSortService,
    private overviewService: FleetOverviewService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.selectedSortItem = 'name';
  }

  public customDialogue(custom: string): void {
    this._dialog
      .open(VehicleCustomizationComponent, {
        width: '600px',
        disableClose: true,
        data: {
          title: 'Custom Parameter',
          customdata: custom,
          allowedParams: this.overviewService.dialogParams()
        }
      })
      .afterClosed()
      .toPromise()
      .then(data => {
        if (data) {
          this.customParamsChange.emit(false);
          this.apiService.updateFleetUserPreferences(data).subscribe(
            preferences => {
              if (preferences['canFamilyCodesPref']) {
                this.overviewService.setUserPreferences(preferences);

                this.customParamsChange.emit(true);
              }
            },
            err => {
              console.log(err);
            }
          );
        }
      });
  }

  sortBy(attribute) {
    if (this.selectedSortItem === attribute) {
      this.isAsc = !this.isAsc;
    } else {
      this.isAsc = true;
    }

    this.selectedSortItem = attribute;

    this.overviewSortService.isAscending = this.isAsc;
    this.overviewSortService.sortAttribute = attribute;
    this.overviewSortService.sortPanelData();
  }
}
