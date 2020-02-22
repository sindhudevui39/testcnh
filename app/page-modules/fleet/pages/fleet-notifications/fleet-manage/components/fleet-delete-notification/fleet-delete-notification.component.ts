import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '@services/user/user.service';
import { BrandNames, BrandColors } from '@enums/brand.enum';
import { FleetEditDeleteService } from '@fleet/pages/fleet-notifications/fleet-manage/services/fleet-edit-delete.service';
import { FleetManageService } from '@fleet/pages/fleet-notifications/fleet-manage/services/fleet-manage.service';
import { FleetManageComponent } from '@fleet/pages/fleet-notifications/fleet-manage/fleet-manage.component';

export interface DialogData {
  id: string;
  notificationGroupId: string;
  name: string;
  created: string;
  deleteButtonText: string;
}

@Component({
  selector: 'app-fleet-delete-notification',
  templateUrl: './fleet-delete-notification.component.html',
  styleUrls: ['./fleet-delete-notification.component.css']
})
export class FleetDeleteNotificationComponent implements OnInit {
  public brand: string;
  brands = BrandNames;
  buttonBGColor: string;
  userEmail: string;
  created: string;
  deleteButtonText: string;

  constructor(
    private userService: UserService,
    private fleetEditDeleteService: FleetEditDeleteService,
    private fleetManageService: FleetManageService,
    public dialogRef: MatDialogRef<FleetManageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit() {
    this.created = this.data.created;
    this.deleteButtonText = this.data.deleteButtonText;
    this.brand = this.userService.getBrand();
    this.buttonBGColor =
      this.userService.getBrand() === BrandNames.CIH ? BrandColors.CIH : BrandColors.NH;
    this.userEmail = this.userService.getUser().email;
  }
  onNoClick(): void {
    this.fleetManageService.updateManagePage();
    this.dialogRef.close();
  }

  delete(id: string, notificationGroupId: string) {
    if (this.created === 'ByMe') {
      this.fleetEditDeleteService.deleteNotification(id).subscribe(() => {
        this.fleetManageService.getCustomNotificationsData().subscribe(() => {
          this.onNoClick();
        });
      });
    } else {
      this.fleetEditDeleteService
        .deleteUserNotification(notificationGroupId, this.userEmail)
        .subscribe(() => this.onNoClick());
    }
  }
}
