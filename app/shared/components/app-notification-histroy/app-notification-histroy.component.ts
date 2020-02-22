import { Component, OnInit, OnDestroy } from '@angular/core';
import { FleetFilterDataStoreService } from '../../../page-modules/fleet/services/fleet-filter-data-store/fleet-filter-data-store.service';
import * as moment from 'moment';
import { FleetPostNotificationService } from '@fleet/pages/fleet-notifications/fleet-manage/services/fleet-post-notification.service';
import * as _ from 'underscore';
import { Subscription } from 'rxjs';
import { UserService } from '@services/user/user.service';
import { BrandNames } from '@enums/brand.enum';
import { TranslateService } from '@ngx-translate/core';
import { FleetHistroyNotificationService } from '@services/fleet-histroy-notification/fleet-histroy-notification.service';
import { FleetHistoryService } from '@fleet/pages/fleet-notifications/fleet-history/services/fleet-history.service';
@Component({
  selector: 'app-notification-histroy',
  templateUrl: './app-notification-histroy.component.html',
  styleUrls: ['./app-notification-histroy.component.css']
})
export class AppNotificationHistroyComponent implements OnInit, OnDestroy {
  historyAlertList: any = {};
  historiesCustomKey: Array<string> = [];
  historiesFaultKey: Array<string> = [];
  selectedTab = 0;
  histroyResponse: any = {};
  historyCustomList: any = {};
  notificationHistory: Subscription;
  lastNotificationTab: Subscription;
  unreadOfAlerts = 0;
  unreadOfCustom = 0;
  brands = BrandNames;
  brand: string;
  translatedWords: any = {};
  constructor(
    private userService: UserService,
    private fleetPostNotificationService: FleetPostNotificationService,
    private _fleetFilterDataStoreService: FleetFilterDataStoreService,
    private _fleetHistoryService: FleetHistoryService,
    private _fleetHistroyNotificationService: FleetHistroyNotificationService,
    private readonly translate: TranslateService
  ) { }
  tabchange(tab) {
    this._fleetHistoryService.lastNotificationUpdate(tab ? true : false);
  }
  ngOnDestroy() {
    this.notificationHistory.unsubscribe();
    this.lastNotificationTab.unsubscribe();
  }
  checkhighFaluts(number) {
    return this.translatedWords.HIGH_FAULTS.replace('replace', number);
  }
  ngOnInit() {
    this.translate
      .get('ALERTS.FAULTS_NUMBER.HIGH_FAULTS', {
        count: 'replace'
      })
      .subscribe(res => {
        this.translatedWords.HIGH_FAULTS = res;
      });

    this.translate
      .get([
        'FILE_NOTIFICATION.NOTIFICATION_HISTORY.VEHICLE_OVERVIEW',
        'FILE_NOTIFICATION.NOTIFICATION_HISTORY.CUSTOM_NOTIFICATION',
        'FILE_NOTIFICATION.NOTIFICATION_HISTORY.NO_ALERTS',
        'FILE_NOTIFICATION.NOTIFICATION_HISTORY.NO_CUSTOM',
        'FILE_NOTIFICATION.NOTIFICATION_HISTORY.NOTIFICATIONS',
        'FILE_NOTIFICATION.NOTIFICATION_HISTORY.ALERTS',
        'FILE_NOTIFICATION.NOTIFICATION_HISTORY.CUSTOM'
      ])
      .subscribe(res => {
        this.translatedWords['VEHICLE_OVERVIEW'] =
          res['FILE_NOTIFICATION.NOTIFICATION_HISTORY.VEHICLE_OVERVIEW'];
        this.translatedWords['CUSTOM_NOTIFICATION'] =
          res['FILE_NOTIFICATION.NOTIFICATION_HISTORY.CUSTOM_NOTIFICATION'];
        this.translatedWords['NO_ALERTS'] = res['FILE_NOTIFICATION.NOTIFICATION_HISTORY.NO_ALERTS'];
        this.translatedWords['NO_CUSTOM'] = res['FILE_NOTIFICATION.NOTIFICATION_HISTORY.NO_CUSTOM'];
        this.translatedWords['NOTIFICATIONS'] =
          res['FILE_NOTIFICATION.NOTIFICATION_HISTORY.NOTIFICATIONS'];
        this.translatedWords['ALERTS'] = res['FILE_NOTIFICATION.NOTIFICATION_HISTORY.ALERTS'];
        this.translatedWords['CUSTOM'] = res['FILE_NOTIFICATION.NOTIFICATION_HISTORY.CUSTOM'];
      });
    this.brand = this.userService.getBrand();
    this.lastNotificationTab = this._fleetHistoryService.LastNoticationHistoryTab$.subscribe(
      (tabSelection: boolean) => {
        this.selectedTab = tabSelection ? 1 : 0;
        this.makePutHistroylist();
      }
    );
    this.notificationHistory = this._fleetHistroyNotificationService.notificationHistoryModels$.subscribe(
      response => {
        if (response) {
          response.days = _.sortBy(response.days, 'day').reverse();
          this.histroyResponse = Object.assign({}, response);
          this.makePutHistroylist();
          this.makeFaultsList(response.days);
          this.makeCustomeList(response.days);
        }
      },
      error => console.log(error)
    );
  }
  makePutHistroylist() {
    if (this.histroyResponse['lastNotificationDatetime']) {
      this.unreadOfAlerts = 0;
      this.unreadOfCustom = 0;
      if (this.selectedTab && this.histroyResponse['lastNotificationDatetime']['CUSTOM_RULE']) {
        this._fleetHistoryService
          .putMethodCustomHistory(this.histroyResponse['lastNotificationDatetime']['CUSTOM_RULE'])
          .subscribe();
      } else if (this.histroyResponse['lastNotificationDatetime']['FAULT']) {
        this._fleetHistoryService
          .putMethodAlertHistory(this.histroyResponse['lastNotificationDatetime']['FAULT'])
          .subscribe();
      }
    }
  }
  updateUnReadCount() {
    const readCountValue = this.unreadOfAlerts + this.unreadOfCustom;
    this._fleetHistroyNotificationService.updateNotificationUnread(readCountValue);
  }
  makeCustomeList(res) {
    this.unreadOfCustom = 0;
    this.historyCustomList = {};
    let history = [];
    const urlNotificationType = this.userService.user['isDealer'] ? 'companies' : 'vehicles';
    const urlNotificationID = this.userService.user['isDealer'] ? 'company' : 'vehicle';
    res.forEach(item => {
      _.where(item.notificationTypes, {
        notificationType: 'CUSTOM_RULE'
      }).forEach(vehicles => {
        vehicles[urlNotificationType].forEach(severity => {
          severity.rules.forEach(rule => {
            if (rule.unreadCount > 0) {
              this.unreadOfCustom++;
            }
            const histroyEach = {
              vechicleName: severity[urlNotificationID].name,
              readCount: rule.readCount + rule.unreadCount + ' ' + rule.name,
              unreadCount: rule.unreadCount,
              titleDate: rule.lastNotificationDatetime,
              dateTimeFormat: this.getTimeOrDate(rule.lastNotificationDatetime)
            };
            history.push(histroyEach);
          });
        });
      });
    });
    this.historiesCustomKey = [];
    history = history
      .sort((b, a) => moment.utc(b.titleDate).diff(moment.utc(a.titleDate)))
      .reverse();
    history.forEach(notify => {
      let dateTimeFormat = this._fleetHistoryService.getDateFormat(
        notify.titleDate
      );
      if (
        dateTimeFormat === 'GLOBAL.TODAY' ||
        dateTimeFormat === 'GLOBAL.YESTERDAY'
      ) {
        dateTimeFormat = this.translate.instant(dateTimeFormat);
      }
      if (!(dateTimeFormat in this.historyCustomList)) {
        this.historyCustomList[dateTimeFormat] = [];
      }
      this.historyCustomList[dateTimeFormat].push(notify);
    });
    this.historiesCustomKey = Array.from(
      new Set(
        history
          .sort((b, a) => moment.utc(b.titleDate).diff(moment.utc(a.titleDate)))
          .map(m => this._fleetHistoryService.getDateFormat(m.titleDate))
      )
    ).reverse();
    this.historiesCustomKey.forEach((keys, index) => {
      if (keys === 'GLOBAL.TODAY' || keys === 'GLOBAL.YESTERDAY') {
        this.historiesCustomKey[index] = this.translate.instant(keys);
      }
    });
    this.updateUnReadCount();
  }
  getTimeOrDate(date) {
    const checkToday = moment(date).calendar(null, {
      sameDay: '[TODAY]'
    });
    return checkToday === 'TODAY'
      ? moment(date).format('hh:mm a')
      : moment(date).format('MM/DD/YYYY');
  }
  makeFaultsList(res) {
    this.unreadOfAlerts = 0;
    this.historyAlertList = {};
    let history = [];
    const urlNotificationType = this.userService.user['isDealer'] ? 'companies' : 'vehicles';
    const urlNotificationID = this.userService.user['isDealer'] ? 'company' : 'vehicle';
    res.forEach(item => {
      _.where(item.notificationTypes, {
        notificationType: 'FAULT'
      }).forEach(vehicles => {
        vehicles[urlNotificationType].forEach(severity => {
          if (severity.severity) {
            if (severity.severity.HIGH.unreadCount > 0) {
              this.unreadOfAlerts++;
            }
            const histroyEach = {
              vechicleName: severity[urlNotificationID].name,
              readCount: severity.severity.HIGH.readCount + severity.severity.HIGH.unreadCount,
              unreadCount: severity.severity.HIGH.unreadCount,
              titleDate: severity.severity.HIGH.lastNotificationDatetime,
              dateTimeFormat: this.getTimeOrDate(severity.severity.HIGH.lastNotificationDatetime)
            };
            history.push(histroyEach);
          }
        });
      });
    });
    this.historiesFaultKey = [];
    history = history
      .sort((b, a) => moment.utc(b.titleDate).diff(moment.utc(a.titleDate)))
      .reverse();
    history.forEach(notify => {
      let dateTimeFormat = this._fleetHistoryService.getDateFormat(
        notify.titleDate
      );
      if (
        dateTimeFormat === 'GLOBAL.TODAY' ||
        dateTimeFormat === 'GLOBAL.YESTERDAY'
      ) {
        dateTimeFormat = this.translate.instant(dateTimeFormat);
      }
      if (!(dateTimeFormat in this.historyAlertList)) {
        this.historyAlertList[dateTimeFormat] = [];
      }
      this.historyAlertList[dateTimeFormat].push(notify);
    });
    this.historiesFaultKey = Array.from(
      new Set(
        history
          .sort((b, a) => moment.utc(b.titleDate).diff(moment.utc(a.titleDate)))
          .map(m => this._fleetHistoryService.getDateFormat(m.titleDate))
      )
    ).reverse();
    this.historiesFaultKey.forEach((keys, index) => {
      if (keys === 'GLOBAL.TODAY' || keys === 'GLOBAL.YESTERDAY') {
        this.historiesFaultKey[index] = this.translate.instant(keys);
      }
    });
    this.updateUnReadCount();
  }
}
