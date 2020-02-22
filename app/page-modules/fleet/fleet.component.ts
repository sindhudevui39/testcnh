import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { EvoNotificationService } from '@services/evo-notification/evo-notification.service';
import { EvoSocketService, EvoSocketEvent } from '@services/evo-socket/evo-socket.service';
import { FleetDataService } from './services/fleet-data.service';
import { FleetFilterDataStoreService } from './services/fleet-filter-data-store/fleet-filter-data-store.service';
import { FleetPostNotificationService } from './pages/fleet-notifications/fleet-manage/services/fleet-post-notification.service';
import { FleetService } from './services/fleet.service';
import { NavmapService } from './services/navmap.service';
import { RemoteDisplayService } from '@remote-display/services/remote-display/remote-display.service';
import { UserService } from '@services/user/user.service';

import { IConnectionStatus } from '@remote-display/rdv.models';

@Component({
  selector: 'app-fleet',
  templateUrl: './fleet.component.html',
  styleUrls: ['./fleet.component.css']
})
export class FleetComponent implements OnInit, OnDestroy {
  currentRoute: string;
  isRouteNotifications: boolean;
  enableRemoteDisplayView: boolean;
  rdvStatus: IConnectionStatus = {
    enable: false
  };
  private _rdvSubcription$ = new Subject();

  constructor(
    private _fleetDataStore: FleetFilterDataStoreService,
    private router: Router,
    private navMapService: NavmapService,
    private fleetdata: FleetDataService,
    private userService: UserService,
    private translateService: TranslateService,
    private fleetPostNotficationService: FleetPostNotificationService,
    private fleetService: FleetService,
    private _evoSocketService: EvoSocketService,
    private _evoNotificationService: EvoNotificationService,
    private _remoteDisplay: RemoteDisplayService
  ) {
    this.translateService.setDefaultLang('en');

    this.assignRoute(this.router.url);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        const route: string = event['url'];

        this.assignRoute(route);
      }
      if (event instanceof NavigationEnd) {
        this._fleetDataStore.updateFleetData();

        if (event.url === '/fleet/overview' || event.url === '/fleet/overview/map') {
          this.fleetService._clickedId.next(0);
          this.fleetService._elementCount.next(0);
          this.navMapService.showMap = true;
        } else {
          this.navMapService.showMap = false;
        }
        if (event.url.split('/')[2] === 'detail') {
          this.fleetService.getCanFeature();
        } else {
          this.fleetService.showCanFeature = false;
        }

        if (event.url === '/fleet/faults') {
          this.fleetService._clickedId.next(0);
          this.fleetService._elementCount.next(0);
        }
        if (event.url === '/fleet/overview') {
          this.fleetService._clickedId.next(0);
          this.fleetService._elementCount.next(0);
          this.navMapService.selectedOption = 'list';
        }

        if (event.url === '/fleet/vehicalInfo') {
          this.fleetdata.showOverviewNav = true;
        } else {
          this.fleetdata.showOverviewNav = false;
        }
      }
    });

    this._remoteDisplay.initSocketConn$.subscribe(initialize => {
      if (initialize) {
        this.setupSocketEvents();
      } else {
        this._rdvSubcription$.next();
      }
    });
  }

  ngOnInit() {
    this.translateService.use(this.userService.getUserPreferredLang());

    this.translateService
      .get('PAGE_MAIN.ALERTS.FAULTS_NUMBER.HIGH_FAULTS', { count: 'replace' })
      .subscribe(res => {
        this.fleetPostNotficationService.translatedForNotificationHistroy.HIGH_FAULTS = res;
      });

    this.translateService
      .get([
        'PAGE_NOTIFICATION.TAB_HISTORY.NO_CUSTOM',
        'PAGE_NOTIFICATION.TAB_HISTORY.NO_ALERTS',
        'PAGE_MAIN.ALERTS.CUSTOM_NOTIFICATION',
        'PAGE_VEHICLE_DETAILS.VEHICLE_OVERVIEW',
        'PAGE_MAIN.MENU.NOTIFICATIONS',
        'GLOBAL.TODAY',
        'GLOBAL.YESTERDAY',
        'PAGE_MAIN.ALERTS.ALERTS',
        'PAGE_FLEET_LIST.CUSTOM'
      ])
      .subscribe(res => {
        this.fleetPostNotficationService.translatedForNotificationHistroy.NO_CUSTOM =
          res['PAGE_NOTIFICATION.TAB_HISTORY.NO_CUSTOM'];
        this.fleetPostNotficationService.translatedForNotificationHistroy.NO_ALERTS =
          res['PAGE_NOTIFICATION.TAB_HISTORY.NO_ALERTS'];
        this.fleetPostNotficationService.translatedForNotificationHistroy.CUSTOM_NOTIFICATION =
          res['PAGE_MAIN.ALERTS.CUSTOM_NOTIFICATION'];
        this.fleetPostNotficationService.translatedForNotificationHistroy.VEHICLE_OVERVIEW =
          res['PAGE_VEHICLE_DETAILS.VEHICLE_OVERVIEW'];
        this.fleetPostNotficationService.translatedForNotificationHistroy.NOTIFICATIONS =
          res['PAGE_MAIN.MENU.NOTIFICATIONS'];
        this.fleetPostNotficationService.translatedForNotificationHistroy.TODAY =
          res['GLOBAL.TODAY'];
        this.fleetPostNotficationService.translatedForNotificationHistroy.YESTERDAY =
          res['GLOBAL.YESTERDAY'];
        this.fleetPostNotficationService.translatedForNotificationHistroy.ALERTS =
          res['PAGE_MAIN.ALERTS.ALERTS'];
        this.fleetPostNotficationService.translatedForNotificationHistroy.CUSTOM =
          res['PAGE_FLEET_LIST.CUSTOM'];
      });

    this.translateService
      .get('GLOBAL.FLEET.SINGULAR')
      .subscribe(data => (this.fleetPostNotficationService.translatedWords.fleet = data));

    this.translateService
      .get('GLOBAL.VEHICLE.PLURAL')
      .subscribe(data => (this.fleetPostNotficationService.translatedWords.vehicles = data));

    this.translateService
      .get('GLOBAL.ALL')
      .subscribe(data => (this.fleetPostNotficationService.translatedWords.all = data));

    this.translateService
      .get('GLOBAL.MODEL.ALL')
      .subscribe(data => (this.fleetPostNotficationService.translatedWords.allModels = data));

    this.translateService
      .get('TROWSER.CUSTOM_NOTIFICATION.RULE_CREATION.VEHICLE_PARAMETER')
      .subscribe(
        data => (this.fleetPostNotficationService.translatedWords.vehicleParameter = data)
      );

    this.translateService
      .get('GLOBAL.COMPANY.ALL')
      .subscribe(data => (this.fleetPostNotficationService.translatedWords.allCompanies = data));

    this.translateService
      .get('GLOBAL.ROLE.ALL')
      .subscribe(data => (this.fleetPostNotficationService.translatedWords.allRoles = data));
  }

  ngOnDestroy() {
    this._rdvSubcription$.next();
    this._rdvSubcription$.unsubscribe();
  }

  assignRoute(route) {
    route.includes('/fleet/notifications')
      ? (this.isRouteNotifications = true)
      : (this.isRouteNotifications = false);
  }

  private setupSocketEvents(): void {
    this._evoSocketService.init();

    this._evoSocketService
      .onEvent(EvoSocketEvent.FLEET_RDV)
      .pipe(takeUntil(this._rdvSubcription$))
      .subscribe(
        data => this._remoteDisplay.handleRDVSocketResponse(data),
        error => console.log(error),
        () => this._evoSocketService.close()
      );

    this._remoteDisplay.enableRemoteDisplayView$.pipe(takeUntil(this._rdvSubcription$)).subscribe(
      (data: IConnectionStatus) => {
        if (data) {
          if (data.enable) {
            this.rdvStatus = data;

            if (!this.enableRemoteDisplayView) {
              this.enableRemoteDisplayView = true;
            }
          } else {
            this.enableRemoteDisplayView = false;
          }
        }
      },
      error => console.log(error),
      () => {
        if (this._remoteDisplay.isRdvInitiated) {
          this._remoteDisplay.updateRDVInitiated(false);
          this._remoteDisplay.enableRemoteDisplayView(false);

          this._evoNotificationService.updateDeviceNotificationSync(
            this._remoteDisplay.vehicleId,
            this._remoteDisplay.requestId
          );
        }
      }
    );

    this._remoteDisplay.initializeRDV();
  }
}
