import { Component, OnInit, Input } from '@angular/core';

import { VehicleInfo } from '../../fleet-detail.component';

@Component({
  selector: 'app-fleet-vehicle-info',
  templateUrl: './fleet-vehicle-info.component.html',
  styleUrls: ['./fleet-vehicle-info.component.css']
})
export class FleetVehicleInfoComponent implements OnInit {
  @Input()
  public vehicleInfo: VehicleInfo;

  constructor() {}

  ngOnInit() {}
}
