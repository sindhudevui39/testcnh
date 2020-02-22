import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { switchMap, filter, take, finalize, catchError } from 'rxjs/operators';

import { IframeService } from '@services/iframe/iframe.service';
import { Urls } from '@enums/urls.enum';
import { ApiService } from '@services/api/api.service';

const dataClientUrls: Array<string> = [
  Urls.GET_CLIENTS,
  Urls.GET_CLIENTS_CONNECT_INFO,
  Urls.DISCONNECT_APP
];

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  private _tokenRefreshInProgress = false;
  private _tokenSubject = new BehaviorSubject<boolean | null>(null);
  private _dataTokenRefreshInProgress = false;
  private _dataTokenSubject = new BehaviorSubject<boolean | null>(null);

  private readonly _iframeService: IframeService;
  private readonly _apiService: ApiService;

  constructor(private _injector: Injector) {
    this._iframeService = this._injector.get(IframeService);
    this._apiService = this._injector.get(ApiService);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          if (
            error.status === 401 ||
            (error.status === 500 &&
              error.error.message &&
              error.error.message.startsWith('The Token has expired'))
          ) {
            if (dataClientUrls.includes(request.url)) {
              return this.handleDataTokenError(request, next);
            } else {
              if (!this._iframeService.urlUpdated) {
                this._iframeService.updateIframeUrl('REFRESH');
              }

              return this.handleTokenError(request, next);
            }
          }

          return throwError(error);
        }
      })
    );
  }

  private handleTokenError(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this._tokenRefreshInProgress) {
      this._tokenRefreshInProgress = true;
      this._tokenSubject.next(null);

      return this._iframeService.updateAccessToken().pipe(
        switchMap(() => {
          this._tokenSubject.next(true);
          return next.handle(req);
        }),
        catchError(error => throwError(error)),
        finalize(() => {
          this._iframeService.urlUpdated = false;
          this._tokenRefreshInProgress = false;
        })
      );
    } else {
      return this._tokenSubject.pipe(
        filter(updated => updated),
        take(1),
        switchMap(() => next.handle(req))
      );
    }
  }

  private handleDataTokenError(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this._dataTokenRefreshInProgress) {
      this._dataTokenRefreshInProgress = true;
      this._dataTokenSubject.next(null);

      return this._apiService.getDataAuthorizationCode().pipe(
        switchMap(response => {
          this._dataTokenSubject.next(true);
          return next.handle(req);
        }),
        catchError(error => throwError(error)),
        finalize(() => {
          this._dataTokenRefreshInProgress = false;
        })
      );
    } else {
      return this._dataTokenSubject.pipe(
        filter(updated => updated),
        take(1),
        switchMap(() => next.handle(req))
      );
    }
  }
}
