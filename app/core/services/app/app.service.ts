import { Injectable, RendererFactory2, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material';
import { Observable, of } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';

import { UserService } from '@services/user/user.service';

import { EulaDialogComponent } from '@shared-components/eula-dialog/eula-dialog.component';

import { Urls } from '@enums/urls.enum';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private _renderer: Renderer2;

  constructor(
    private _http: HttpClient,
    private _rendererFactory: RendererFactory2,
    private _eulaDialog: MatDialog,
    private _userService: UserService
  ) {
    this._renderer = this._rendererFactory.createRenderer(null, null);
  }

  public init(): void {
    this._renderer.listen('window', 'storage', event => {
      if (!event) {
        event = window.event;
      }

      if (event.key === 'getSessionStorage') {
        localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
        localStorage.removeItem('sessionStorage');
      } else if (event.key === 'sessionStorage' && !sessionStorage.length) {
        const data = JSON.parse(event.newValue);

        for (const key in data) {
          if (key) {
            sessionStorage.setItem(key, data[key]);
          }
        }
      }
    });

    if (!sessionStorage.length) {
      localStorage.setItem('getSessionStorage', 'dummy-item');
      localStorage.removeItem('getSessionStorage');
    }
  }

  public isEulaRequired(): boolean {
    const { isEulaAccepted, isDealer } = this._userService.getUser();

    if (isEulaAccepted || isDealer) {
      return false;
    }

    return true;
  }

  public openEulaDialog(): Observable<any> {
    const config = new MatDialogConfig();

    config.panelClass = ['custom-dialog-container', 'eula'];
    config.disableClose = true;

    return this.getEulaLinks().pipe(
      concatMap((links: any[]) => {
        if (links) {
          config.data = links;

          return this._eulaDialog
            .open(EulaDialogComponent, config)
            .afterClosed()
            .pipe(concatMap(() => this._userService.acceptEula()));
        } else {
          return of(undefined);
        }
      })
    );
  }

  private getEulaLinks(): Observable<undefined | any[]> {
    const eulaBrand = this._userService.getBrand() === 'Case IH' ? 'AFS' : 'PLM';

    const { countryCode, preferredLanguage } = this._userService.getUser();

    return this._http
      .post(`${Urls.GET_EULA}`, {
        countryCode,
        preferredLanguage,
        brand: eulaBrand
      })
      .pipe(
        concatMap(data => {
          if (data['content'] && data['content'].length > 0) {
            return of<any[]>(data['content']);
          } else {
            return of(undefined);
          }
        }),
        catchError(() => of(undefined))
      );
  }
}
