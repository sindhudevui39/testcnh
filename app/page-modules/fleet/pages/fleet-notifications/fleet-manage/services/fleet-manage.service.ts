import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay, catchError } from 'rxjs/operators';
import { FleetNotification } from '@models/fleet-notification';
import { UserService } from '@services/user/user.service';
import { FleetUrls } from '@fleet/services/fleet-api/fleet-urls.enum';

@Injectable({
  providedIn: 'root'
})
export class FleetManageService {
  notifications = [];
  userEmail: string;
  notificationCount = 0;
  createdByMeCount = 0;
  createdForMeCount = 0;
  private _notificationGroups: any;
  private customNotificationList: any;
  public editNotificationDetails: any = {};
  public notificationGroups$ = new BehaviorSubject<any>(null);
  private _updateManagePage = new BehaviorSubject(true);
  public updateManagePage$ = this._updateManagePage.asObservable();
  public currentIndex$ = new BehaviorSubject<Number>(0);
  private _notificationCount = new BehaviorSubject(0);
  public notificationCount$ = this._notificationCount.asObservable();
  private _createdByMeCount = new BehaviorSubject(0);
  public createdByMeCount$ = this._createdByMeCount.asObservable();
  private _createdForMeCount = new BehaviorSubject(0);
  public createdForMeCount$ = this._createdForMeCount.asObservable();

  constructor(private http: HttpClient, private userService: UserService) {
    this.userEmail = userService['_user'].email;
  }

  public getNotificationGroupsData(): void {
    this.http.get(`${FleetUrls.FLEET_NOTIFICATIONS_GROUPS}?userEmail=${this.userEmail}`).subscribe(
      (data: Array<any>) => {
        this.getNotificationGroups(data);
        this._notificationGroups = [...data];
        this.notificationGroups$.next(this._notificationGroups);
      },
      error => {
        catchError(error);
        console.log(error);
      }
    );
  }
  setEditNotificationDetails(id) {
    this.editNotificationDetails = this.customNotificationList.filter(f => f.id === id)[0];
    return this.editNotificationDetails;
  }
  clearEditNotification() {
    this.editNotificationDetails = {};
  }
  getCustomNotificationsData() {
    return this.http.get(`${FleetUrls.FLEET_CUSTOM_NOTIFICATIONS}`).pipe(
      map(data => {
        this._createdByMeCount.next(0);
        if (data && data['content']) {
          this.customNotificationList = data['content'];
          return this.getCustomNotifications(data['content']);
        }
        return [];
      }),
      shareReplay(1)
    );
  }

  getUserNotificationsData() {
    return this.http.get(`${FleetUrls.FLEET_USER_NOTIFICATIONS}`).pipe(
      map(data => {
        this._createdForMeCount.next(0);
        if (data && data['content']) {
          return this.getUserNotifications(data['content']);
        }
        return [];
      }),
      shareReplay(1)
    );
  }

  getCount() {
    this.notificationCount = this.createdByMeCount + this.createdForMeCount;
    this._notificationCount.next(this.notificationCount);
  }
  getNotificationGroups(data) {
    this.notifications = [];
    if (data) {
      data.forEach(item => {
        const notificationGroup: any = {
          id: item.id,
          usersCount: item.usersCount,
          vehicleId: item.vehicleId,
          channels: item.channel ? item.channel : ['N/A']
        };
        this.notifications.push(notificationGroup);
      });

      return this.notifications;
    } else {
      return {};
    }
  }

  getCustomNotifications(data) {
    this.notifications = [];
    this.createdByMeCount = 0;
    if (data) {
      data.forEach(item => {
        const customNotification: FleetNotification = {
          id: item.id,
          name: item.name ? item.name : 'N/A',
          modelsCount: item.modelsCount,
          vehiclesCount: item.vehiclesCount,
          notificationGroupId: item.notificationGroupId,
          usersCount: item.usersCount ? item.usersCount : 'N/A',
          channels: item.channels ? item.channels : ['N/A'],
          canRule: this.getConditionEnum(item.canRule)
        };
        this.createdByMeCount++;
        this.notifications.push(customNotification);
      });
      this._createdByMeCount.next(this.createdByMeCount);

      return this.notifications;
    } else {
      return {};
    }
  }

  getUserNotifications(data) {
    this.notifications = [];
    this.createdForMeCount = 0;
    if (data) {
      data.forEach(item => {
        const userNotification: FleetNotification = {
          id: item.id,
          name: item.name ? item.name : 'N/A',
          modelsCount: item.modelsCount,
          vehiclesCount: item.vehiclesCount,
          notificationGroupId: item.notificationGroupId,
          usersCount: item.usersCount ? item.usersCount : 'N/A',
          channels: item.channels ? item.channels : ['N/A'],
          canRule: this.getConditionEnum(item.canRule)
        };
        this.createdForMeCount++;
        this.notifications.push(userNotification);
      });
      this._createdForMeCount.next(this.createdForMeCount);
      return this.notifications;
    }
  }

  getChannels(vehicleId: any, channels: any) {
    if (vehicleId !== null && channels.length > 1) {
      return '[SMS, WEB]';
    } else {
      return 'WEB';
    }
  }

  getConditionEnum(rule: any): string {
    rule.durationMs = rule.durationMs / 1000;
    rule.label = rule.label ? rule.label : 'N/A';
    rule.condition = rule.condition ? rule.condition : 'N/A';
    rule.threshold = rule.threshold ? parseFloat(rule.threshold).toFixed(2) : 'N/A';
    rule.unit = rule.unit ? rule.unit : 'N/A';
    rule.durationMs = rule.durationMs ? rule.durationMs : 'N/A';
    return rule;
  }
  updateManagePage() {
    this._updateManagePage.next(true);
  }
}
