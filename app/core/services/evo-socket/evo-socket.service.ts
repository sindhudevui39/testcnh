import { Injectable } from '@angular/core';

import * as SocketIO from 'socket.io-client';
import { Observable } from 'rxjs';

import { AppSettingsService } from '@services/app-settings/app-settings.service';

export enum EvoSocketEvent {
  FLEET_RDV = 'Fleet:RemoteDisplay',
  NOTIFICATION_CUSTOM = 'Notification:Custom',
  NOTIFICATION_FAULTS = 'Notification:Faults'
}

export interface IEvoSocketMessage {
  subscribers: Array<string>;
  topics: Array<string>;
}

@Injectable({
  providedIn: 'root'
})
export class EvoSocketService {
  private _socket: SocketIOClient.Socket;

  constructor(private _appSettingService: AppSettingsService) {}

  public init(): void {
    const { evoNotificationPath } = this._appSettingService.appSettings;
    const { notificationUrl } = this._appSettingService.rdvSettings;

    this._socket = SocketIO(notificationUrl, {
      path: evoNotificationPath,
      transports: ['polling']
    });
  }

  public send(message: IEvoSocketMessage): void {
    this._socket.emit('subscribeTopics', message);
  }

  public onEvent(event: EvoSocketEvent): Observable<any> {
    return new Observable<any>(observer => {
      this._socket.on(event, (data: any) => {
        observer.next(data);
      });
    });
  }

  public close(): void {
    this._socket.close();
  }
}
