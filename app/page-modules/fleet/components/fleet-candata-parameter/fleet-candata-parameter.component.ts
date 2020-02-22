import { Component, OnInit, Input } from '@angular/core';
import { VehicleInfo } from '@fleet/pages/fleet-detail/fleet-detail.component';

@Component({
  selector: 'app-fleet-candata-parameter',
  templateUrl: './fleet-candata-parameter.component.html',
  styleUrls: ['./fleet-candata-parameter.component.css']
})
export class FleetCandataParameterComponent implements OnInit {
  @Input()
  public vehicleInfo: VehicleInfo;

  constructor() {}

  ngOnInit() {}
}
