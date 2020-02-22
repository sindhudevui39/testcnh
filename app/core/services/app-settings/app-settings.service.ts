import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppSettings } from '@models/app-settings';
import { Urls } from '@enums/urls.enum';
import { IRdvSettings } from '@remote-display/rdv.models';
import { RDVUrls } from '@remote-display/rdv.enums';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {
  private _appSettings: AppSettings;
  private _rdvSettings: IRdvSettings;

  constructor(private http: HttpClient) {}

  public get appSettings(): AppSettings {
    return this._appSettings;
  }

  public set appSettings(appSettings: AppSettings) {
    this._appSettings = appSettings;
  }

  public get rdvSettings(): IRdvSettings {
    return this._rdvSettings;
  }

  public set rdvSettings(settings: IRdvSettings) {
    this._rdvSettings = settings;
  }

  public getAppSettings(): Observable<AppSettings> {
    return this.http.get<AppSettings>(Urls.APP_SETTINGS);
  }

  public getRdvSettings(): Observable<IRdvSettings> {
    return this.http.get<IRdvSettings>(`${RDVUrls.RDV_SETTINGS}`);
  }
}
