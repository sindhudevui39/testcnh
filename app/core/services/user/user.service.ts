import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay, tap, map } from 'rxjs/operators';

import { User } from '@models/user';
import { BrandNames } from '@enums/brand.enum';
import { Urls } from '@enums/urls.enum';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _user: User;
  public hasDashboardAccess$ = new BehaviorSubject<boolean>(null);
  public isDealer$ = new BehaviorSubject<boolean>(null);
  private _userPreferences = new BehaviorSubject<any>(null);
  public userPreferences$ = this._userPreferences.asObservable();
  public setBrandFromAppSetting: string;
  public _hasClimateAccess: boolean;
  public storedUserPreferences: any = {};

  constructor(private http: HttpClient) {}

  public setUserPreferences(value) {
    this._userPreferences.next(value);
  }

  public getUser(): User {
    return this._user;
  }

  public get user() {
    return this._user;
  }

  public getTimeFormat() {
    return this._user.preferredDateTime;
  }

  public set user(userResponse: any) {
    const _user: User = {
      id: userResponse.id,
      companyId: userResponse.companyId,
      firstName: userResponse.firstName,
      lastName: userResponse.lastName,
      email: userResponse.email,
      phone: userResponse.phone,
      roles: userResponse.roles,
      brand: userResponse.brand == null ? 'NHAG' : userResponse.brand,
      isDealer: userResponse.isDealer ? userResponse.isDealer : false,
      isEulaAccepted: userResponse.eulaAccepted,
      preferredLanguage: userResponse.preferredLanguage ? userResponse.preferredLanguage : 'en',
      preferredTimeZone: userResponse.preferredTimeZone,
      preferredDateTime: userResponse.preferredDateTime,
      countryCode: userResponse.countryCode,
      companyName: userResponse.companyName
    };

    if (this.setBrandFromAppSetting) {
      _user.brand = this.setBrandFromAppSetting;
    }

    this._user = _user;
    if (this._user.preferredDateTime) {
      if (this._user.preferredDateTime.includes('@')) {
        this._user.preferredDateTime = this._user.preferredDateTime.split('@')[0];
      } else if (this._user.preferredDateTime.includes(',')) {
        this._user.preferredDateTime = this._user.preferredDateTime.split(',')[0];
      } else {
        this._user.preferredDateTime = this._user.preferredDateTime.split(' ')[0];
      }
    } else {
      this._user.preferredDateTime = 'MM/DD/YYYY';
    }
  }

  public setBrandFromAppSettingfn(brand) {
    this.setBrandFromAppSetting = brand;
  }

  public getUserPhone() {
    const userDetail = {
      email: this._user.email,
      phone: this._user.phone
    };
    return userDetail;
  }

  public getBrand() {
    if (this._user) {
      return (this._user.brand && this._user.brand.toUpperCase()) === 'CSAG'
        ? BrandNames.CIH
        : BrandNames.NH;
    }
  }

  public getUserPreferredLang() {
    if (this._user) {
      return this._user.preferredLanguage.toLowerCase();
    }
  }

  public getUserDetails() {
    return this.http.get(`${Urls.USER_DETAILS}`, {
      observe: 'response'
    });
  }

  public getUserPreferences() {
    return this.http
      .get(`${Urls.USER_PREFERENCE}/${this._user.email}`, {
        observe: 'response'
      })
      .pipe(
        tap(data => {
          this.storedUserPreferences = data ? data.body : {};
        }),
        shareReplay(1)
      );
  }

  public get hasClimateAccess(): boolean {
    return this._hasClimateAccess;
  }

  public set hasClimateAccess(value: boolean) {
    this._hasClimateAccess = value;
  }

  public acceptEula(): Observable<any> {
    return this.http.put(`${Urls.EULA}/${this.getUser().email}`, {});
  }

  public updateUserPreferences(userPreferenceData: HttpResponse<any>): void {
    this.hasDashboardAccess$.next(userPreferenceData.body['dashboardAccess']);
    this.setUserPreferences(userPreferenceData.body['preferences']);
    this.hasClimateAccess = userPreferenceData.body['climateAccess'];
  }
  public getUserFMISFilters() {
    return this.http
      .get(`${Urls.GET_FMIS_FILTERS}`, {
        headers: { userCompany: this._user.companyName },
        observe: 'response'
      })
      .pipe(map((response: any) => response.body));
  }
}
