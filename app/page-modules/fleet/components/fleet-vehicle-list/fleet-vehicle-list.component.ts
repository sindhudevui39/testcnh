import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

import { FleetService } from '@fleet/services/fleet.service';
import { FleetDataService } from '@fleet/services/fleet-data.service';
import { FleetUtilService } from '@fleet/services/fleet-util/fleet-util.service';
import { FleetFilterEventsService } from '@fleet/services/events/fleet-filter-events.service';

@Component({
  selector: 'app-fleet-vehicle-list',
  templateUrl: './fleet-vehicle-list.component.html',
  styleUrls: ['./fleet-vehicle-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FleetVehicleListComponent implements OnInit {
  @Input()
  vehicle;

  @Input()
  clickedId;

  @Input()
  collapse;

  @Output()
  vehicleId: EventEmitter<string> = new EventEmitter<string>();
  id;

  highlightValue: string;
  activeListValue: any;
  showTooltip = false;
  hoveredItem: string;
  content: string;
  executeTimeout: boolean;

  constructor(
    private fleetService: FleetService,
    private _filterEventsService: FleetFilterEventsService,
    public fleetdata: FleetDataService,
    private fleetutilService: FleetUtilService
  ) {}

  ngOnInit() {
    this.fleetService.clickedId$.subscribe(id => {
      this.id = id;
      this.activeListValue = id;
    });

    this._filterEventsService.searchValue$.subscribe(value => {
      this.highlightValue = value;
    });
  }

  exportID(vehicle) {
    this.vehicleId.emit(vehicle.id);
  }

  getBorderColor(vehicle) {
    let status;
    if (vehicle.status) {
      status = vehicle.status.name;
    } else {
      return 'transparent';
    }
    return this.fleetutilService.checkStatus(status);
  }
}
