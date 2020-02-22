import { Component, OnInit } from '@angular/core';
import { FleetPostNotificationService } from '@fleet/pages/fleet-notifications/fleet-manage/services/fleet-post-notification.service';
import { MatDialog } from '@angular/material';
import { FleetNotification } from '@models/fleet-notification';
import { FleetAddNotificationComponent } from '@fleet/pages/fleet-notifications/fleet-manage/components/fleet-add/fleet-add-notification/fleet-add-notification.component';
import { forkJoin } from 'rxjs';
import { UserService } from '@services/user/user.service';
import { FleetManageService } from './services/fleet-manage.service';
import { FleetEditPreferenceComponent } from './components/fleet-edit-preference/fleet-edit-preference.component';
import { FleetDeleteNotificationComponent } from './components/fleet-delete-notification/fleet-delete-notification.component';
import { FleetEditNotificationGroupComponent } from './components/fleet-edit-notification-group/fleet-edit-notification-group.component';
@Component({
  selector: 'app-fleet-manage',
  templateUrl: './fleet-manage.component.html',
  styleUrls: ['./fleet-manage.component.css']
})
export class FleetManageComponent implements OnInit {
  customNotifications: any = [];
  notificationsGroups: any[] = [];
  userNotifications: any = [];
  isCollapsed = [];
  dataLoaded = false;
  userNotificationCount: number;
  customNotificationCount: number;
  checked: boolean;
  emailChecked: boolean;
  createdForMeData: any;
  createdByMeData: any;
  isDataEmpty = false;
  isUNEmpty = false;

  constructor(
    private _fleetPostNotificationService: FleetPostNotificationService,
    private fleetManageService: FleetManageService,
    public userService: UserService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.dataLoaded = false;
    this.isDataEmpty = false;

    this._fleetPostNotificationService.vehicleList();
    this._fleetPostNotificationService.vehicleList$.subscribe(data => {
      if (data) {
        if (Object.keys(data).length > 0) {
          this.isDataEmpty = false;
        } else {
          this.isDataEmpty = true;
        }
      }
    });

    this.fleetManageService.updateManagePage$.subscribe(value => {
      this.dataLoaded = false;

      if (value) {
        forkJoin(
          this.fleetManageService.getUserNotificationsData(),
          this.fleetManageService.getCustomNotificationsData()
        ).subscribe(data => {
          this.customNotifications = data[1];
          this.userNotifications = data[0];
          this.dataLoaded = true;
        });

        this.notificationsGroups = [];
        const notificationsGroup: FleetNotification = {
          id: null,
          name: 'Recent Fault Occurences',
          modelsCount: 'All',
          vehiclesCount: 'All',
          notificationGroupId: null,
          usersCount: 'All',
          channels: ['SMS', 'Web'],
          canRule: null
        };
        this.notificationsGroups.push(notificationsGroup);
      }
    });

    this.fleetManageService.createdByMeCount$.subscribe((count: number) => {
      this.customNotificationCount = count;
      this.createdByMeData = {
        count
      };
    });

    this.fleetManageService.createdForMeCount$.subscribe((count: number) => {
      this.userNotificationCount = count;
      this.createdForMeData = {
        count
      };
    });
    this.fleetManageService.getNotificationGroupsData();
    this.fleetManageService.notificationGroups$.subscribe(data => {
      if (data) {
        const filteredData = data
          .filter(f => f.channel.includes('SMS') && f.vehicleId)
          .map(m => m.vehicleId);
        this._fleetPostNotificationService.saveFaultNotificationList(filteredData);
      }
    });
  }
  AddNotification(): void {
    const dialogRef = this.dialog.open(FleetAddNotificationComponent, {
      width: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
      height: '100%'
    });

    dialogRef.afterClosed().subscribe(result => {
      this._fleetPostNotificationService.vehicleList();
      this._fleetPostNotificationService.vehicleList$.subscribe();

      this._fleetPostNotificationService.userList();
      this._fleetPostNotificationService.userList$.subscribe();
    });
  }

  editNotificationGroup(): void {
    const detail = this.userService.getUserPhone();
    const phone = detail.phone.slice(-4);
    const email = detail.email;
    const dialogRef = this.dialog.open(FleetEditNotificationGroupComponent, {
      width: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
      height: '100%',
      data: { phone: phone }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }
  editNotification(id: string) {
    const data = this.fleetManageService.setEditNotificationDetails(id);
    const dialogRef = this.dialog.open(FleetAddNotificationComponent, {
      width: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
      height: '100%',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      this.fleetManageService.clearEditNotification();
      this.fleetManageService.currentIndex$.next(0);
    });
  }
  editPreference(id: string, notificationType: string) {
    let data;
    if (notificationType === 'ByMe') {
      data = this.getNotificationById(id);
    } else {
      data = this.getUserNotificationById(id);
    }
    const detail = this.userService.getUserPhone();
    const phone = detail.phone.slice(-4);
    const email = detail.email;

    if (data.channels.includes('SMS')) {
      this.checked = true;
    } else {
      this.checked = false;
    }
    if (data.channels.includes('Email')) {
      this.emailChecked = true;
    } else {
      this.emailChecked = false;
    }
    const dialogRef = this.dialog.open(FleetEditPreferenceComponent, {
      height: '260px',
      width: '470px',
      maxWidth: '80vw',
      data: {
        name: data.name,
        phone: phone,
        email: email,
        checked: this.checked,
        emailChecked: this.emailChecked,
        groupId: data.notificationGroupId,
        notificationType: notificationType
      }
    });
    dialogRef.afterClosed().subscribe(result => {});
  }

  getNotificationById(id) {
    return this.customNotifications.filter(f => f.id === id)[0];
  }
  getUserNotificationById(id) {
    return this.userNotifications.filter(f => f.id === id)[0];
  }

  deleteNotification(id: string, notificationType: string): void {
    let data;
    if (notificationType === 'ByMe') {
      data = this.getNotificationById(id);
    } else {
      data = this.getUserNotificationById(id);
    }
    const dialogRef = this.dialog.open(FleetDeleteNotificationComponent, {
      height: '240px',
      width: '442px',
      maxWidth: '80vw',
      data: {
        id: id,
        notificationGroupId: data.notificationGroupId,
        name: data.name,
        created: notificationType,
        deleteButtonText: notificationType === 'ByMe' ? 'Delete' : 'Remove'
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }
}
