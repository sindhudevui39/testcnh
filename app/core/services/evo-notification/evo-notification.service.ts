import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '@services/user/user.service';
import { DeviceNotificationEvent, RDVUrls } from '@remote-display/rdv.enums';
import { Observable } from 'rxjs';
import { ITransactionId, IDeviceNotification } from '@remote-display/rdv.models';

@Injectable({
  providedIn: 'root'
})
export class EvoNotificationService {
  constructor(private _http: HttpClient, private _userService: UserService) {}

  public updateDeviceNotification(
    event: DeviceNotificationEvent,
    vehicleId: string
  ): Observable<ITransactionId> {
    return this._http.post<ITransactionId>(
      this.getDeviceNotificationUrl(),
      this.getDeviceNotification(event, vehicleId)
    );
  }

  public updateDeviceNotificationSync(vehicleId: string, requestId: string) {
    const xhr = new XMLHttpRequest();

    xhr.open('POST', this.getDeviceNotificationUrl(requestId), false);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(JSON.stringify(this.getDeviceNotification(DeviceNotificationEvent.ABORT, vehicleId)));
  }

  public abortDeviceNotification(vehicleId: string, requestId: string): Observable<any> {
    return this._http.post(
      this.getDeviceNotificationUrl(requestId),
      this.getDeviceNotification(DeviceNotificationEvent.ABORT, vehicleId)
    );
  }

  private getDeviceNotification(
    event: DeviceNotificationEvent,
    vehicleId: string
  ): IDeviceNotification {
    const { firstName, lastName } = this._userService.user;

    const deviceNotification: IDeviceNotification = {
      notification: {
        event: event,
        timeStamp: Date.now(),
        firstname: firstName,
        lastname: lastName
      },
      vehicleIDList: [vehicleId]
    };

    return deviceNotification;
  }

  private getDeviceNotificationUrl(requestId?: string): string {
    let url = `${RDVUrls.DEVICE_NOTIFICATION}?sessionId=${this._userService.getUser().id}`;

    if (requestId) {
      url += `&requestId=${requestId}`;
    }

    return url;
  }
}
