import { Injectable } from '@angular/core';
import { shareReplay, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { FleetHistory } from '@models/fleet-history';
import { BehaviorSubject } from 'rxjs';
import { FleetCanRule } from '@models/fleet-can-rule';
import { UserService } from '@services/user/user.service';
import * as moment from 'moment';
import { FleetPostNotificationService } from '@fleet/pages/fleet-notifications/fleet-manage/services/fleet-post-notification.service';
import { FleetUrls } from '@fleet/services/fleet-api/fleet-urls.enum';

@Injectable({
  providedIn: 'root'
})
export class FleetHistoryService {
  notificationCount = 0;
  private _notificationCount = new BehaviorSubject(0);
  public notificationCount$ = this._notificationCount.asObservable();
  public LastNoticationHistoryTab$ = new BehaviorSubject<boolean>(false);

  public orderedKeys;

  constructor(
    private http: HttpClient,
    public _userService: UserService,
    private fleetPostNotificationService: FleetPostNotificationService
  ) {}

  getHistoryData() {
    return this.http.get(`${FleetUrls.FLEET_HISTORY}`).pipe(
      map(data => this.getHistories(data['content'])),
      shareReplay(1)
    );
  }
  lastNotificationUpdate(tabSelection) {
    this.LastNoticationHistoryTab$.next(tabSelection);
  }
  putMethodAlertHistory(date) {
    return this.http
      .put(`${FleetUrls.PUT_NOTIFICATIONS}` + '?email=' + this._userService.user['email'], {
        lastNotificationDatetime: date
      })
      .pipe(
        map(data => data),
        shareReplay(1)
      );
  }
  putMethodCustomHistory(date) {
    return this.http
      .put(`${FleetUrls.PUT_CUSTOM_NOTIFICATIONS}` + '?email=' + this._userService.user['email'], {
        lastNotificationDatetime: date
      })
      .pipe(
        map(data => data),
        shareReplay(1)
      );
  }

  getHistories(data) {
    const histories = {};
    this.notificationCount = 0;
    if (data) {
      data.forEach(item => {
        const history: FleetHistory = {
          vehicleName: item.vehicleName,
          name: item.rule.name,
          brand: item.brand,
          vehicleSerialNumber: item.vehicleSerialNumber,
          dateTime: item.notificationDate,
          canRule: this.getConditionEnum(item.rule.canRule)
        };
        this.notificationCount++;

        const key = this.getDateFormat(item.notificationDate);

        if (!(key in histories)) {
          histories[key] = [];
        }
        histories[key].push(history);
      });
      this.orderedKeys = Array.from(
        new Set(
          data
            .sort((b, a) => moment.utc(b.notificationDate).diff(moment.utc(a.notificationDate)))
            .map(m => this.getDateFormat(m.notificationDate))
        )
      ).reverse();
      this._notificationCount.next(this.notificationCount);
      return histories;
    } else {
      return {};
    }
  }

  getDateFormat(date) {
    return moment(date).calendar(null, {
      lastWeek: 'MMMM DD',
      lastDay: '[' + 'GLOBAL.YESTERDAY' + ']',
      sameDay: '[' + 'GLOBAL.TODAY' + ']',
      sameElse: function() {
        return 'MMMM DD';
      }
    });
  }
  getConditionEnum(rule): FleetCanRule {
    rule.durationMs = parseInt(rule.durationMs, 10) / 1000;
    return rule;
  }
}
