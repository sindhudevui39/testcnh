import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fleet-confirmation-summary',
  templateUrl: './fleet-confirmation-summary.component.html',
  styleUrls: ['./fleet-confirmation-summary.component.css']
})
export class FleetConfirmationSummaryComponent implements OnInit {
  @Input()
  finalNotificationName;
  @Input()
  usersCount;
  @Input()
  vehicleCount;
  @Input()
  customCondition: string;
  @Input()
  customDuration: any;
  @Input()
  customThreshold: string;
  @Input()
  customParameter: string;
  @Input()
  channel;
  @Input()
  customthresholdValue;
  @Input()
  success: boolean;

  constructor() {}

  ngOnInit() {}
}
