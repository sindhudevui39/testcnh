import { Injectable, Inject, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import {
  catchError,
  concatMap,
  delay,
  filter,
  retryWhen,
  switchMap,
  take,
  tap
} from 'rxjs/operators';

import { AuthService } from '@services/auth/auth.service';

import { Urls } from '@enums/urls.enum';

@Injectable({
  providedIn: 'root'
})
export class IframeService {
  private _renderer: Renderer2;
  private _htmlBody: HTMLBodyElement;
  private _sessionIframe: HTMLIFrameElement;
  private _iframeAdded = false;
  private _pollingSession = false;
  private _urlUpdated = false;
  private _accessCodeSource = new BehaviorSubject<string | null>(null);
  public accessCode$ = this._accessCodeSource.asObservable();

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _http: HttpClient,
    private _rendererFactory: RendererFactory2,
    private _authService: AuthService
  ) {
    this._htmlBody = <HTMLBodyElement>this._document.getElementsByTagName('body')[0];
    this._renderer = this._rendererFactory.createRenderer(null, null);
  }

  public init() {
    this._authService.logOutInitiated$
      .pipe(filter(val => val))
      .subscribe(() => this._accessCodeSource.unsubscribe());

    if (!this._iframeAdded) {
      this.createSessionIframe();
      this._iframeAdded = true;
    }
  }

  public get urlUpdated() {
    return this._urlUpdated;
  }

  public set urlUpdated(value) {
    this._urlUpdated = value;
  }

  public updateAccessToken(): Observable<boolean> {
    return this.accessCode$.pipe(
      filter(code => code !== null),
      take(1),
      switchMap(code =>
        this._http.get(`${Urls.ACCESS_TOKEN_UPDATE}?authCode=${code}`, {
          observe: 'response'
        })
      ),
      switchMap(() => of(true)),
      retryWhen(errors =>
        errors.pipe(
          concatMap((error, count) => {
            if (count < 5 && error.status === 500) {
              return of(error.status);
            }

            return throwError(error);
          }),
          tap(() => this.updateIframeUrl('REFRESH')),
          delay(1000)
        )
      ),
      catchError(error => {
        this._authService.logout();

        return throwError(error);
      })
    );
  }

  public updateIframeUrl(updateType?: string): void {
    switch (updateType) {
      case 'POLL':
        this._pollingSession = true;
        this._sessionIframe.src = this._authService.getAuthorizeUrl();

        break;
      case 'REFRESH':
      default:
        if (this._pollingSession) {
          this._pollingSession = false;
        } else {
          this._sessionIframe.src = this._authService.getAuthorizeUrl();
        }

        this._accessCodeSource.next(null);
        this.urlUpdated = true;

        break;
    }
  }

  private createSessionIframe() {
    this._sessionIframe = <HTMLIFrameElement>this._renderer.createElement('iframe');
    this._sessionIframe.style.display = 'none';

    this._renderer.listen('window', 'message', this.messageHandler.bind(this));
    this._htmlBody.appendChild(this._sessionIframe);
  }

  private messageHandler(e: any) {
    if (e.source === this._sessionIframe.contentWindow) {
      if (e.data.code) {
        if (this._pollingSession) {
          this._pollingSession = false;
        } else {
          if (!this._accessCodeSource.closed) {
            this._accessCodeSource.next(e.data.code);
          }
        }
      } else {
        this._accessCodeSource.unsubscribe();
        this._authService.auth0Login();
      }
    }
  }
}
