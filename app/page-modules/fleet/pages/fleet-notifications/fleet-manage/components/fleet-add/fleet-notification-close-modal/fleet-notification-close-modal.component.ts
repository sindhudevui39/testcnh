import { Component, OnInit } from '@angular/core';
import { BrandNames, BrandColors } from '@enums/brand.enum';
import { UserService } from '@services/user/user.service';
import { MatDialogRef } from '@angular/material';
import { FleetPostNotificationService } from '../../../services/fleet-post-notification.service';
import { FleetVehicleUserService } from '../../../services/fleet-vehicle-user.service';

@Component({
  selector: 'app-fleet-notification-close-modal',
  templateUrl: './fleet-notification-close-modal.component.html',
  styleUrls: ['./fleet-notification-close-modal.component.css']
})
export class FleetNotificationCloseModalComponent implements OnInit {
  public brand: string;
  brands = BrandNames;
  buttonBGColor: string;
  data: any;

  constructor(
    private userService: UserService,
    private fleetPostNotificationService: FleetPostNotificationService,
    private fleetVehicleService: FleetVehicleUserService,
    public dialogRef: MatDialogRef<FleetNotificationCloseModalComponent>
  ) {}

  ngOnInit() {
    this.brand = this.userService.getBrand();
    this.buttonBGColor =
      this.userService.getBrand() === BrandNames.CIH ? BrandColors.CIH : BrandColors.NH;
  }

  onNoClick(): void {
    this.dialogRef.close({
      cancel: true
    });
  }

  exitButton() {
    this.fleetPostNotificationService._customNotificationData = {};
    this.fleetVehicleService.selectedVehicleIds$.next([]);
    this.fleetPostNotificationService.userData = [];

    this.dialogRef.close();
  }
}
