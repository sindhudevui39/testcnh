import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { NavigationStart, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { forkJoin, Observable, of, Subscription, throwError } from 'rxjs';
import { catchError, concatMap, filter, tap } from 'rxjs/operators';

import { ApiService } from '@services/api/api.service';
import { AppSettingsService } from '@services/app-settings/app-settings.service';
import { AppService } from '@services/app/app.service';
import { AuthService } from '@services/auth/auth.service';
import { FaviconService } from './favicon/favicon.service';
import { IframeService } from '@services/iframe/iframe.service';
import { UserService } from '@services/user/user.service';
import { UtilService } from '@services/util/util.service';

import { BrandNames } from '@enums/brand.enum';
import {
  validModuleRoutes,
  validApplicationRoutes,
  validApplicationRoutesWithId
} from './app-routes';

import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private _accessCodeSubscription: Subscription;
  private _climateAuthCode: string;

  public brands = BrandNames;
  public activeRoute: string;
  public loadApp = false;

  constructor(
    private _location: Location,
    private _router: Router,
    private _titleService: Title,
    private _appService: AppService,
    private _appSettings: AppSettingsService,
    private _iframeService: IframeService,
    private _authService: AuthService,
    private _apiService: ApiService,
    public _userService: UserService,
    private _utilService: UtilService,
    private _faviconService: FaviconService,
    private _translateSerivce: TranslateService
  ) {
    this._translateSerivce.setDefaultLang('en');

    if (this._location.path().indexOf('login-redirect') > -1) {
      const regex = new RegExp('[\\?&]code=([^&#]*)');

      this._climateAuthCode = regex.exec(this._location.path())[1].replace('code=', '');

      this._apiService.getClimateAuthCode(
        this._climateAuthCode,
        window.location.href.split('?code=')[0] + '&'
      );
    }

    this._router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe(event => {
      const route: string = event['url'];

      if (
        validModuleRoutes.includes(route) ||
        validApplicationRoutes.includes(route) ||
        validApplicationRoutesWithId.filter(r => route.startsWith(r)).length > 0
      ) {
        this.setCurrentRoute(route);
      }
    });
  }

  public ngOnInit(): void {
    this._appService.init();
    this._iframeService.init();

    this._accessCodeSubscription = this._iframeService.accessCode$
      .pipe(filter(code => (code ? true : false)))
      .subscribe(code => this.loginUser(code));

    this._appSettings.getAppSettings().subscribe(appSettings => {
      this._appSettings.appSettings = appSettings;
      this._userService.setBrandFromAppSettingfn(appSettings.userBrand);

      this._authService.init();

      const url = new URL(window.location.href);
      const searchParams = new URLSearchParams(url.search);

      if (searchParams.get('invite-token')) {
        sessionStorage.setItem('invite-token', searchParams.get('invite-token'));
      }

      const code = this._utilService.getQueryParam('code');

      if (code) {
        this.loginUser(code);
      } else {
        if (sessionStorage.getItem('is-dealer') === 'true') {
          this._iframeService.updateIframeUrl('REFRESH');
        } else {
          this._authService.auth0Login();
        }
      }
    });
  }

  private setCurrentRoute(route: string): void {
    const item = route.startsWith('/') ? route.split('/')[1] : route;

    this._faviconService.activate(item);

    this.activeRoute = item === 'data-access' ? 'data' : item;

    this._titleService.setTitle(item.toUpperCase());

    localStorage.setItem('currentRoute', route.split('?')[0]);

    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);

    if (searchParams.get('invite-token')) {
      sessionStorage.setItem('invite-token', searchParams.get('invite-token'));
    }
  }

  private loginUser(code: string): void {
    this._authService
      .appLogin(code)
      .pipe(
        filter(loginResponse => loginResponse.body['success']),
        concatMap(loginResponse => {
          if (loginResponse.body['userProfile']) {
            this._userService.user = loginResponse.body['userProfile'];
            this._translateSerivce.use(this._userService.getUserPreferredLang());

            return this.getUserPrefs().pipe(
              tap(userPrefs => this._userService.updateUserPreferences(userPrefs)),
              concatMap(() => this.startupHttpCalls()),
              catchError(error => throwError(error))
            );
          } else {
            return of<string>('SILENT_AUTH');
          }
        })
      )
      .subscribe(
        data => {
          if (data === 'SILENT_AUTH') {
            this._iframeService.updateIframeUrl('REFRESH');
          } else {
            this.navigateToCurrentRoute();
          }
        },
        err => this.handleStartupErrors(err)
      );
  }

  private getUserPrefs(): Observable<HttpResponse<any>> {
    if (!this._appService.isEulaRequired()) {
      return this._userService.getUserPreferences();
    } else {
      return this._appService
        .openEulaDialog()
        .pipe(concatMap(() => this._userService.getUserPreferences()));
    }
  }

  private startupHttpCalls(): Observable<any> {
    const rdvSettings$ = this._appSettings.getRdvSettings();
    const dataAuthCode$ = this._apiService.getDataAuthorizationCode();

    return forkJoin(rdvSettings$, dataAuthCode$).pipe(
      tap(data => (this._appSettings.rdvSettings = data[0]))
    );
  }

  private navigateToCurrentRoute() {
    this.loadApp = true;

    this._iframeService.urlUpdated = false;
    this._accessCodeSubscription.unsubscribe();

    // this.pollServerSession();

    const currentRoute = localStorage.getItem('currentRoute');
    const { redirectUri } = this._appSettings.appSettings;
    let path = redirectUri.split('/').pop();

    path = '/' + path;

    this._userService.isDealer$.next(this._userService.getUser().isDealer);

    if (this._userService.getUser().isDealer) {
      sessionStorage.setItem('is-dealer', 'true');
    } else {
      sessionStorage.setItem('is-dealer', 'false');
    }

    if (validModuleRoutes.filter(f => f === path).length > 0) {
      if (currentRoute && currentRoute.startsWith(path)) {
        this._router.navigate([currentRoute]);
      } else {
        this.setCurrentRoute(path);
        this._router.navigate([path]);
      }
    } else {
      if (currentRoute) {
        this.setCurrentRoute(currentRoute);
        this._router.navigate([currentRoute]);
      } else {
        this.setCurrentRoute(environment.defaultRoute);
        this._router.navigate([environment.defaultRoute]);
      }
    }
  }

  private handleStartupErrors(error) {
    switch (error.status) {
      case 400:
      case 500:
        this._authService.auth0Login();

        break;
      case 404:
        if (error.error.message === 'User not found in EVO.') {
          alert(error.error.message);
          this._authService.logout();
        }

        if (error.error.message === 'User preferences not found.') {
          this._userService.hasDashboardAccess$.next(false);
          this.startupHttpCalls().subscribe(() => this.navigateToCurrentRoute());
        }
        break;
      default:
        this._authService.auth0Login();
    }
  }
}
