import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import * as auth0 from 'auth0-js';

import { AppSettingsService } from '@services/app-settings/app-settings.service';
import { UserService } from '@services/user/user.service';

import { Urls } from '@enums/urls.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth0: auth0.WebAuth;
  additionalOpts: any;

  public logOutInitiated$ = new Subject<boolean>();
  private _authCode = '';

  constructor(
    @Inject('window') private _window: Window,
    private http: HttpClient,
    private appSettingsService: AppSettingsService,
    private _userService: UserService
  ) {}

  public init() {
    const { clientID, domain, audience, redirectUri } = this.appSettingsService.appSettings;

    this.auth0 = new auth0.WebAuth({
      clientID,
      domain,
      audience,
      redirectUri,
      responseType: 'code',
      scope: 'openid profile user_metadata',
      responseMode: 'query'
    });

    const { host, protocol } = this._window.location;
    const silentUrl = `${protocol}//${host}/silent`;

    this.additionalOpts = {
      redirectUri: silentUrl,
      prompt: 'none'
    };
  }

  get authCode() {
    return this._authCode;
  }

  set authCode(value: string) {
    this._authCode = value;
  }
  public auth0Login() {
    this.auth0.authorize();
  }

  public appLogin(code: string) {
    return this.http.get(`${Urls.LOGIN}?authCode=${code}`, {
      observe: 'response'
    });
  }

  public getAuthorizeUrl() {
    return this.auth0.client.buildAuthorizeUrl(this.additionalOpts);
  }

  public getAuthorizationCode(code: string) {
    return this.http.get(`${Urls.AUTH_CODE}?authCode=${code}`, {
      observe: 'response'
    });
  }

  public logout() {
    const logoutOptions = {
      clientID: this.appSettingsService.appSettings.clientID
    };

    if (this._userService.getUser() && this._userService.getUser().isDealer) {
      logoutOptions['returnTo'] = this.appSettingsService.appSettings.dpLogoutUrl;
    } else {
      logoutOptions['returnTo'] = this.appSettingsService.appSettings.redirectUri;
      logoutOptions['federated'] = true;
    }

    this.logOutInitiated$.next(true);
    this.auth0.logout(logoutOptions);
  }
}
