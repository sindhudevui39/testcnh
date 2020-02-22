import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { BehaviorSubject, Observable, of, throwError, Subject } from 'rxjs';
import { catchError, filter, switchMap, takeUntil } from 'rxjs/operators';

import { AppSettingsService } from '@services/app-settings/app-settings.service';
import { EvoNotificationService } from '@services/evo-notification/evo-notification.service';
import { EvoSocketService } from '@services/evo-socket/evo-socket.service';
import { PingService } from '@services/ping/ping.service';
import { RemoteDisplayUtilService } from '@remote-display/services/remote-display-util/remote-display-util.service';
import { RdvUiService } from '@remote-display/services/rdv-ui/rdv-ui.service';
import { TranslatedRDVLabelStoreService } from '@remote-display/services/translated-rdv-label-store/translated-rdv-label-store.service';

import { IConnectionStatus, ISocketResponse, ITransactionId } from '@remote-display/rdv.models';
import {
  ConnectionStatus,
  DeviceNotificationEvent,
  RdvDialogTypes,
  TranslatedRDVLabels
} from '@remote-display/rdv.enums';
import { StatusCode } from '@enums/vehicle-status.enum';

@Injectable({
  providedIn: 'root'
})
export class RemoteDisplayService {
  private _requestId: string;
  private _vehicleId: string;
  private _vehicleName: string;
  private _enableRemoteDisplayView = new BehaviorSubject<IConnectionStatus>({ enable: false });
  private _initSocketConn = new BehaviorSubject<boolean>(false);
  private _rdvInitiated = new BehaviorSubject<boolean>(false);

  public enableRemoteDisplayView$ = this._enableRemoteDisplayView.asObservable();
  public initSocketConn$ = this._initSocketConn.asObservable();
  public rdvInitiated$ = this._rdvInitiated.asObservable();

  private _pingServiceSub$ = new Subject();

  constructor(
    private _appSettings: AppSettingsService,
    private _evoNotificationService: EvoNotificationService,
    private _evoSocketService: EvoSocketService,
    private _rdvLabels: TranslatedRDVLabelStoreService,
    private _rdvUiService: RdvUiService,
    private _rdvUtil: RemoteDisplayUtilService,
    private _pingService: PingService
  ) {}

  public get vehicleId(): string {
    return this._vehicleId;
  }

  public get requestId(): string {
    return this._requestId;
  }

  public get isRdvInitiated(): boolean {
    return this._rdvInitiated.value;
  }

  public launchTeamviewer(id: string, name: string): void {
    this._vehicleId = id;
    this._vehicleName = name;

    const recommendedVersion = this._appSettings.rdvSettings.minVersion;
    const maxVersion = this._appSettings.rdvSettings.maxVersionCheck + recommendedVersion;

    const userTvVersion = this._rdvUtil.getUserTvVersion(maxVersion);

    if (userTvVersion < recommendedVersion) {
      this._rdvUiService.openRdvDialog(RdvDialogTypes.UNSUPPORTED_VERSION);
    } else if (userTvVersion === maxVersion) {
      this._rdvUiService.openRdvDialog(RdvDialogTypes.INSTALL);
    } else {
      this._initSocketConn.next(true);
    }
  }

  public updateRDVInitiated(value: boolean) {
    this._rdvInitiated.next(value);
  }

  public enableRemoteDisplayView(enable: boolean, response?: ISocketResponse) {
    if (!enable) {
      this._enableRemoteDisplayView.next({ enable: false });
    } else {
      this.updateRemoteDisplayView(response);
    }
  }

  public initializeRDV(): void {
    this._rdvInitiated.next(true);
    this.startDeviceNotification();
    this.updateRemoteDisplayView({
      connectionStatus: ConnectionStatus.WAITING
    });
  }

  private startDeviceNotification(): void {
    this._evoNotificationService
      .updateDeviceNotification(DeviceNotificationEvent.START, this._vehicleId)
      .pipe(catchError(err => this.handleConnectionFailed(err, 'START')))
      .subscribe((response: ITransactionId) => {
        if (response.transactionId) {
          this._requestId = response.requestId;

          this._evoSocketService.send(this._rdvUtil.generateRDVMessage(response.transactionId));
        }
      });
  }

  public abortDeviceNotification(message?: string): void {
    this._rdvUtil.closeTeamviewer();

    this._evoNotificationService
      .abortDeviceNotification(this._vehicleId, this._requestId)
      .pipe(catchError(err => this.handleConnectionFailed(err, 'ABORT')))
      .subscribe(() => {
        this._requestId = '';

        if (message === 'RETRY') {
          this.startDeviceNotification();
        } else {
          this.disableRemoteDisplayView();
          this.handleAbortResponse(message);
        }
      });
  }

  public handleRDVSocketResponse(response: any): void {
    const socketResponse = this._rdvUtil.getSocketResponse(response);

    if (socketResponse.launchTvApp) {
      this._rdvUtil.openTeamviewer(socketResponse.tvAppUrl);
      this.updateRemoteDisplayView(socketResponse);

      this._pingService.unitsData$
        .pipe(
          filter(data => data.length > 0),
          switchMap(data =>
            data.find(unit => unit['id'] === this._vehicleId)['status']['name'] === StatusCode.OFF
              ? of(true)
              : of(false)
          ),
          filter(status => status),
          takeUntil(this._pingServiceSub$)
        )
        .subscribe(() => {
          this._evoNotificationService
            .abortDeviceNotification(this._vehicleId, this._requestId)
            .subscribe();
          this.disableRemoteDisplayView();
          this.handleAbortResponse('PAGE_RDV.TERMINATION_CLIENT');
        });
    } else if (socketResponse.updateView) {
      if (socketResponse.code === '007') {
        this.abortDeviceNotification('RETRY');
      }

      this.updateRemoteDisplayView(socketResponse);
    } else if (socketResponse.abort) {
      this.abortDeviceNotification(socketResponse.abortMessage);
    }
  }

  private updateRemoteDisplayView(response: ISocketResponse): void {
    const update: IConnectionStatus = {
      enable: true,
      socketResponse: response,
      vehicleName: this._vehicleName
    };

    this._enableRemoteDisplayView.next(update);
  }

  private disableRemoteDisplayView(): void {
    this._enableRemoteDisplayView.next({ enable: false });
    this._rdvInitiated.next(false);
    this._pingServiceSub$.next();
  }

  private handleConnectionFailed(
    err: any,
    requestType: string
  ): Observable<any> | Observable<never> {
    if (err instanceof HttpErrorResponse) {
      if (this.isRdvInitiated) {
        this._rdvInitiated.next(false);
      }

      if (requestType === 'START') {
        const message = this._rdvLabels.getLabel(TranslatedRDVLabels['PAGE_RDV.MESSAGES.ERROR_5']);

        this._enableRemoteDisplayView.next({ enable: false });
        this._rdvUiService.openSnackBar(message);
      }

      return of(err.error['message']);
    }

    return throwError(err);
  }

  private handleAbortResponse(message?: string) {
    switch (message) {
      case RdvDialogTypes.INACTIVE_SUBSCRIPTION:
        this._rdvUiService.openRdvDialog(RdvDialogTypes.INACTIVE_SUBSCRIPTION);

        break;

      case 'PAGE_RDV.TERMINATION_HOST':
      case 'PAGE_RDV.TERMINATION_CLIENT':
        if (this.isRdvInitiated) {
          this._rdvInitiated.next(false);
        }

        let snackBarMsg: string;

        if (message === 'PAGE_RDV.TERMINATION_HOST') {
          snackBarMsg = this._rdvLabels.getLabel(TranslatedRDVLabels['PAGE_RDV.TERMINATION_HOST']);
        } else {
          snackBarMsg = this._rdvLabels.getLabel(
            TranslatedRDVLabels['PAGE_RDV.TERMINATION_CLIENT']
          );
        }

        this._rdvUiService.openSnackBar(snackBarMsg);

        break;
    }

    this._initSocketConn.next(false);
  }
}
