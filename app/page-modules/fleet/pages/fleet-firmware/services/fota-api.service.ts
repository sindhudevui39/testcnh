import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserService } from '@services/user/user.service';

import { FleetUrls } from '@fleet/services/fleet-api/fleet-urls.enum';
import { DeviceNotificationEvent } from '@remote-display/rdv.enums';

@Injectable({
  providedIn: 'root'
})
export class FOTAApiService {
  public _campaignList = [];
  public _campaignList$ = new BehaviorSubject<any[]>(null);
  public campaignList$ = this._campaignList$.asObservable();

  constructor(private http: HttpClient, private userService: UserService) {}

  public fetchCampaignsList(): void {
    this._campaignList = [];

    const startTime = new Date('2018-01-01').toISOString();
    const endTime = new Date(new Date().getTime() + 1000 * 60 * 60 * 24).toISOString();

    this.http
      .get(`${FleetUrls.FOTA_CAMPAIGNS}/${startTime}/${endTime}`)
      .pipe(map(data => (data ? data : [])))
      .subscribe(
        (data: any[]) => {
          this._campaignList = data;
          this._campaignList$.next(this._campaignList);
        },
        error => {
          console.log(error);
        }
      );
  }

  sortByDate(a, b): number {
    return a > b ? -1 : b > a ? 1 : 0;
  }

  public campaignById(id: string) {
    return this.http
      .get(`${FleetUrls.FOTA_CAMPAIGN_BY_ID}/${id}`)
      .pipe(map(data => data['vehicles']));
  }

  FOTADeviceNotification(body): Observable<any> {
    return this.http.post(
      `${FleetUrls.FOTA_DEVICE_NOTIFICATION}?sessionId=${this.userService.getUser().id}`,
      body,
      {
        responseType: 'text',
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    );
  }

  public FOTAGetDeviceNotification(event: DeviceNotificationEvent, vehicleId: string[]): any {
    const { firstName, lastName } = this.userService.user;

    const deviceNotification: any = {
      notification: {
        event: event,
        timeStamp: new Date(new Date().getTime() + 1000 * 60 * 60).toISOString(),
        firstname: firstName,
        lastname: lastName
      },
      vehicleIDList: vehicleId
    };

    return deviceNotification;
  }

  searchBySoftware(event: any): void {
    const searchString = event.searchString.toLowerCase();

    let filteredData: any[];

    if (searchString) {
      filteredData = this._campaignList.filter(f => f.name.toLowerCase().includes(searchString));

      this._campaignList$.next(filteredData);
    } else {
      this._campaignList$.next(this._campaignList);
    }
  }
}
