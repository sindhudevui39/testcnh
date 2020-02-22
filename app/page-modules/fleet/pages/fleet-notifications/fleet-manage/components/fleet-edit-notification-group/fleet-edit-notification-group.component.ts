import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '@services/user/user.service';
import { BrandNames, BrandColors } from '@enums/brand.enum';
import { FleetPostNotificationService } from '@fleet/pages/fleet-notifications/fleet-manage/services/fleet-post-notification.service';
import { HttpClient } from '@angular/common/http';
import { FleetVehicleSelectService } from '@fleet/services/fleet-vehicle-select/fleet-vehicle-select.service';
import { FleetEditVehicleSelectionService } from '@fleet/pages/fleet-notifications/fleet-manage/services/fleet-edit-vehicle-selection.service';
import { FleetManageService } from '@fleet/pages/fleet-notifications/fleet-manage/services/fleet-manage.service';
import { FleetManageComponent } from '@fleet/pages/fleet-notifications/fleet-manage/fleet-manage.component';

export interface DialogData {
  id: string;
  name: string;
  phone: string;
  email: string;
}

@Component({
  selector: 'app-fleet-edit-notification-group',
  templateUrl: './fleet-edit-notification-group.component.html',
  styleUrls: ['./fleet-edit-notification-group.component.css']
})
export class FleetEditNotificationGroupComponent implements OnInit {
  public brand: string;
  brands = BrandNames;
  buttonBGColor: string;

  phoneNumberChecked = false;
  disableConfirm = true;

  constructor(
    private editVehicleSelection: FleetEditVehicleSelectionService,
    private fleetPostNotification: FleetPostNotificationService,
    private userService: UserService,
    private fleetManageService: FleetManageService,
    private dialogRef: MatDialogRef<FleetManageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _http: HttpClient,
    private fleetVehicleSelect: FleetVehicleSelectService
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

  checkPhoneNumber(value) {
    this.phoneNumberChecked = value;
  }

  disableConfirmBtn(value) {
    this.disableConfirm = value;
  }

  updateVehiclesNotification() {
    let vehiclesList = [];

    if (this.phoneNumberChecked) {
      vehiclesList = [...this.editVehicleSelection.getVehiclesNotification()];
    } else {
      const vehiclesNotificationList = [];

      for (const key in this.editVehicleSelection.getIntialVehicleData()) {
        if (key) {
          this.editVehicleSelection.getIntialVehicleData()[key].forEach(f => {
            vehiclesNotificationList.push({
              id: f.id,
              channel: ['WEB']
            });
          });
        }
      }

      vehiclesList = [...vehiclesNotificationList];
    }

    const { email, phone } = this.userService.getUser();

    const request = {
      user: {
        userId: email,
        email,
        phone,
        preferredDateTime: 'dd/MM/yy H:mm:ss',
        preferredTimeZone: 'US/Central',
        tzOffset: '360'
      },
      vehicles: [...vehiclesList]
    };

    this.fleetVehicleSelect.postVehicles(request).subscribe(data => {
      const filteredData = data.notificationGroups
        .filter(f => f.channel.includes('SMS') && f.vehicleId)
        .map(m => m.vehicleId);

      this.fleetPostNotification.saveFaultNotificationList(filteredData);
      this.onNoClick();
    });
  }
}
