import { Injectable } from '@angular/core';
import { UserService } from '@services/user/user.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Urls } from '@enums/urls.enum';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class FleetHistroyNotificationService {
  constructor(private _http: HttpClient, public _userService: UserService) {
    this.notificationHistoryModels$.subscribe(res => {
      let unreadNotify = 0;
      if (res && res['days'].length > 0) {
        res['days'].forEach(element => {
          element.notificationTypes.forEach(vehicles => {
            vehicles[urlNotificationType].forEach(severity => {
              if (vehicles.notificationType === 'FAULT') {
                if (severity.severity && severity.severity.HIGH.unreadCount > 0) {
                  unreadNotify++;
                }
              } else if (vehicles.notificationType === 'CUSTOM_RULE') {
                severity.rules.forEach(rule => {
                  if (rule.unreadCount > 0) {
                    unreadNotify++;
                  }
                });
              }
            });
          });
        });
      }
      this.updateNotificationUnread(unreadNotify);
    });
    const urlNotificationType = this._userService.user['isDealer'] ? 'companies' : 'vehicles';
    const historyNotification$ = this._http
      .get(
        Urls.USER_NOTIFICATIONS +
          '?userEmail=' +
          this._userService.user['email'] +
          '&type=' +
          urlNotificationType +
          '&tzOffset=' +
          new Date().getTimezoneOffset() +
          '&days=7&minSeverity=HIGH'
      )
      .pipe(map(data => data));

    historyNotification$.subscribe(unitsDate => {
      this.updateRes(unitsDate);
    });
  }

  public notificationHistoryModels$ = new BehaviorSubject<any>(null);
  public notificationUnread$ = new BehaviorSubject<Number>(0);

  getNotificationDate() {
    const res = this.notificationHistoryModels$.value;
    this.notificationHistoryModels$.next(res);
  }

  updateNotificationUnread(num: number) {
    this.notificationUnread$.next(num);
  }

  updateRes(res) {
    this.notificationHistoryModels$.next(res);
  }

  public getUnitNotificationsCount(data): any {
    const faults = {};
    const urlNotificationType = this._userService.user['isDealer'] ? 'companies' : 'vehicles';
    const urlNotificationID = this._userService.user['isDealer'] ? 'company' : 'vehicle';
    if (data['days'].length > 0) {
      data['days'].forEach(element => {
        element.notificationTypes.forEach(vehicles => {
          vehicles[urlNotificationType].forEach(severity => {
            if (severity.severity) {
              const vehicleId = severity[urlNotificationID].id;
              const severityData = severity.severity.HIGH;
              const severityCount = severityData.readCount + severityData.unreadCount;

              if (vehicleId in faults) {
                faults[vehicleId].push(severityCount);
              } else {
                faults[vehicleId] = [];
                faults[vehicleId].push(severityCount);
              }
            }
          });
        });
      });
    }

    return faults;
  }
}
