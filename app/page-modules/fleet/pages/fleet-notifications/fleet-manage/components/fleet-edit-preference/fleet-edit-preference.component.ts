import { Component, OnInit, Inject } from '@angular/core';
import { SnackBarComponent } from '@shared-components/snack-bar/snack-bar.component';
import { BrandColors, BrandNames } from '@enums/brand.enum';
import { MAT_DIALOG_DATA, MatSnackBar, MatDialogRef } from '@angular/material';
import { FleetEditDeleteService } from '@fleet/pages/fleet-notifications/fleet-manage/services/fleet-edit-delete.service';
import { UserService } from '@services/user/user.service';
import { FleetManageService } from '@fleet/pages/fleet-notifications/fleet-manage/services/fleet-manage.service';
import { FleetManageComponent } from '@fleet/pages/fleet-notifications/fleet-manage/fleet-manage.component';

export interface DialogData {
  name: string;
  phone: string;
  email: string;
  checked?: boolean;
  emailChecked?: boolean;
  groupId?: string;
  notificationType?: string;
}

@Component({
  selector: 'app-fleet-edit-preference',
  templateUrl: './fleet-edit-preference.component.html',
  styleUrls: ['./fleet-edit-preference.component.css']
})
export class FleetEditPreferenceComponent implements OnInit {
  public brand: string;
  brands = BrandNames;
  buttonBGColor: string;

  constructor(
    private userService: UserService,
    private fleetEditDeleteService: FleetEditDeleteService,
    private fleetManageService: FleetManageService,
    public dialogRef: MatDialogRef<FleetManageComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit() {
    this.brand = this.userService.getBrand();
    this.buttonBGColor =
      this.userService.getBrand() === BrandNames.CIH ? BrandColors.CIH : BrandColors.NH;
  }

  onNoClick(): void {
    this.fleetManageService.updateManagePage();
    this.dialogRef.close();
  }

  edit(
    checked: boolean,
    emailChecked: boolean,
    groupId: string,
    name: string,
    notificationType: string
  ) {
    const channel = ['WEB'];

    if (checked) {
      channel.push('SMS');
    }
    if (emailChecked) {
      channel.push('Email');
    }
    const detail = this.userService.getUserPhone();
    const message = name + ' ' + 'preference has been updated';

    const prefs = {
      id: groupId,
      channel,
      phone: detail.phone,
      email: detail.email,
      notificationType: notificationType
    };

    this.fleetEditDeleteService.editNotification(prefs).subscribe(() => {
      this.onNoClick();
    });

    this.snackBar.openFromComponent(SnackBarComponent, {
      data: message,
      duration: 4000
    });
  }
}
