import { Component, OnInit } from '@angular/core';
import { FleetFirmwareVehicleSelectionComponent } from '../fleet-firmware-vehicle-selection/fleet-firmware-vehicle-selection.component';
import { MatDialogRef } from '@angular/material';
import { BrandNames, BrandColors } from '@enums/brand.enum';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-fleet-firmware-vehicle-modal',
  templateUrl: './fleet-firmware-vehicle-modal.component.html',
  styleUrls: ['./fleet-firmware-vehicle-modal.component.css']
})
export class FleetFirmwareVehicleModalComponent implements OnInit {
  public brand: string;
  brands = BrandNames;
  buttonBGColor: string;
  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<FleetFirmwareVehicleSelectionComponent>
  ) {}

  ngOnInit() {
    this.brand = this.userService.getBrand();
    this.buttonBGColor =
      this.userService.getBrand() === BrandNames.CIH ? BrandColors.CIH : BrandColors.NH;
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
