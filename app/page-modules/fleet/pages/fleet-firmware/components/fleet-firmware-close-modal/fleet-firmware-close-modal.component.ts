import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { FotaFilterService } from '../../services/fota-filter.service';
import { FotaService } from '../../services/fota/fota.service';
import { UserService } from '@services/user/user.service';

import { BrandNames, BrandColors } from '@enums/brand.enum';

@Component({
  selector: 'app-fleet-firmware-close-modal',
  templateUrl: './fleet-firmware-close-modal.component.html',
  styleUrls: ['./fleet-firmware-close-modal.component.css']
})
export class FleetFirmwareCloseModalComponent implements OnInit {
  brand: string;
  buttonBGColor: string;

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<FleetFirmwareCloseModalComponent>,
    private fotaService: FotaService,
    private fotaFilterService: FotaFilterService
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
    this.dialogRef.close();
  }
}
