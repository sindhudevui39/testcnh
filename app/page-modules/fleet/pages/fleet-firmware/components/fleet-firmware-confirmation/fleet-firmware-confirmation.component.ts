import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fleet-firmware-confirmation',
  templateUrl: './fleet-firmware-confirmation.component.html',
  styleUrls: ['./fleet-firmware-confirmation.component.css']
})
export class FleetFirmwareConfirmationComponent implements OnInit {
  @Input()
  success: boolean;

  @Input()
  software: string;

  @Input()
  vehicleCount: number;

  constructor() {}

  ngOnInit() {}
}
