import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
// import { TokenService } from '../../../services/token/token.service';
import { UserService } from '@services/user/user.service';
import * as _ from 'underscore';
import { Urls } from '../../../../../shared/enums/urls.enum';

export interface IJSONPatchOperation {
  op: 'add' | 'replace' | 'remove';
  path: string;
  value: any;
}

@Injectable()
export class DataAccessClientsService {
  private httpOptions: any;
  userEmail: string;
  CompanyId: string;
  stepValue: number;
  Isloading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public list$: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public listfromAPI$: BehaviorSubject<any[]> = new BehaviorSubject([]);

  public routeId$: BehaviorSubject<string> = new BehaviorSubject(null);
  constructor(
    private http: HttpClient,
    // private tokenService: TokenService,
    private userService: UserService
  ) {
    this.stepValue = 0;
    this.userEmail = userService['_user'].email;
  }
  getStepValue() {
    return this.stepValue;
  }
  setStepValue(value: number) {
    this.stepValue = value;
  }
  setRouteId(routeId: string) {
    this.routeId$.next(routeId);
  }
  getDataAccess() {
    this.Isloading$.next(true);
    return this.get(`${Urls.SHARES_ME}`, {}).pipe(
      map((response: any) => {
        this.addlistfromAPI(response);
        this.Isloading$.next(false);
        return response;
      })
    );
  }

  public getShareData() {
    return this.get(`${Urls.SHARES_ME}`, {}).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  public getFilteredListFromAPI(
    predicate: (_: any) => boolean
  ): Observable<any[]> {
    return this.listfromAPI$.pipe(map(list => list.filter(predicate)));
    // .shareReplay(1);
  }

  public getByInviteId(inviteId): Observable<any[]> {
    return this.getFilteredListFromAPI(share => share.inviteId === inviteId);
  }

  public getSentByInviteId(
    inviteId: string | number,
    companyId: string | number
  ): Observable<any> {
    return this.getByInviteId(inviteId).pipe(
      map(shares => {
        return shares
          .filter(
            share =>
              share.sharedByCompanyId && share.sharedByCompanyId === companyId
          )
          .shift();
      })
    );
  }
  public getReceivedByInviteId(
    inviteId: string | number,
    companyId: string | number
  ): Observable<any> {
    return this.getByInviteId(inviteId).pipe(
      map(shares => {
        return shares
          .filter(
            share =>
              share.sharedToCompanyId && share.sharedToCompanyId === companyId
          )
          .shift();
      })
    );
  }
  public getFilteredList(predicate: (_: any) => boolean): Observable<any[]> {
    return this.list$.pipe(map(list => list.filter(predicate)));
    // .shareReplay(1);
  }

  public getinviteId(id?: string | number): Observable<any> {
    const single: boolean = !!id;
    return this.http
      .get<any | any[]>(`${Urls.GET_INVITE_ID}`, {
        headers: new HttpHeaders({
          id: '' + id
        })
      })
      .pipe(
        map((oneOrMoreShares: any | any[]) => {
          let share: any;

          share = oneOrMoreShares as any;
          return [share];
        })
      );
  }

  public createShare(shareData): Observable<any> {
    return (
      this.http
        // .post(this.dataAccess_base_url + "/shares/", shareData, {
        .post(`${Urls.CREATE_SHARE}`, shareData, {
          responseType: 'text',
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
            // ,
            //// 'Authorization': this.tokenService.token
            // 'shareData': JSON.stringify(shareData)
          })
        })
        .pipe(
          map(text => {
            try {
              return JSON.parse(text);
            } catch (_) {
              return text;
            }
          })
        )
    );
  }

  public deleteShare(id: string | number): Observable<any> {
    if (!id) {
      return Observable.throw('Invalid/Missing id argument');
    }
    this.Isloading$.next(true);

    this.httpOptions = {
      headers: new HttpHeaders({
        id: '' + id
      })
    };
    return this.http.delete(`${Urls.DELETE_SHARE}`, this.httpOptions);
  }

  public shareAll(id: string | number): Observable<string> {
    const payload: IJSONPatchOperation[] = [
      {
        op: 'replace',
        path: '/sharedItems',
        value: []
      },
      {
        op: 'replace',
        path: '/shareAll',
        value: true
      },
      {
        op: 'replace',
        path: '/operations',
        value: ['SEEDING', 'PLANTING', 'HARVESTING', 'SPRAYING', 'SPREADING']
      },
      {
        op: 'replace',
        path: '/shareFieldObjects',
        value: true
      }
    ];
    return this.patchShare(id, payload);
  }
  public shareSelected(
    id: string | number,
    selectedFields: any[],
    selectedOperations: any[],
    hasSetupData: boolean
  ): Observable<string> {
    const payload: IJSONPatchOperation[] = [
      {
        op: 'replace',
        path: '/sharedItems',
        value: selectedFields.map(f => ({ id: f.ID, shareType: 'Field' }))
      },
      {
        op: 'replace',
        path: '/shareAll',
        value: false
      },
      {
        op: 'replace',
        path: '/operations',
        value: selectedOperations.map(f => f.name)
      },
      {
        op: 'replace',
        path: '/shareFieldObjects',
        value: hasSetupData
      }
    ];
    return this.patchShare(id, payload);
  }

  public removeAllShares(id: string | number) {
    const payload: IJSONPatchOperation[] = [
      {
        op: 'replace',
        path: '/sharedItems',
        value: []
      },
      {
        op: 'replace',
        path: '/shareAll',
        value: false
      },
      {
        op: 'replace',
        path: '/operations',
        value: []
      },
      {
        op: 'replace',
        path: '/shareFieldObjects',
        value: false
      }
    ];
    return this.patchShare(id, payload);
  }
  public patchShare(
    id: string | number,
    patch: IJSONPatchOperation[]
  ): Observable<string> {
    if (!(id && patch)) {
      return Observable.throw('Invalid/Missing argument(s)');
    }
    this.Isloading$.next(true);
    return this.http
      .patch(`${Urls.PATCH_SHARE}`, patch, {
        responseType: 'text', // some API might not return JSON, avoid auto-parse errors
        headers: new HttpHeaders({
          id: '' + id
        })
      })
      .pipe(
        map((response: any) => {
          this.Isloading$.next(false);
          return response;
        })
      );
  }

  public add(items: any[]): any[] {
    this.list$.next(items);
    return items;
  }
  public addlistfromAPI(items: any[]): any[] {
    this.listfromAPI$.next(items);
    return items;
  }

  postInviteId(tokenFromUrl) {
    sessionStorage.removeItem('invite-token');
    return this.http
      .post(`${Urls.SHARE_INVITE}`, { inviteToken: tokenFromUrl })
      .pipe(
        map(data => {
          console.log(data);
          return data;
        })
      );
  }
  putResendInvite(inviteId) {
    return this.http
      .put(`${Urls.RESEND_INVITE}/${inviteId}`, {
        brandCode: this.userService.user.brand
      })
      .pipe(
        map(data => {
          return data;
        })
      );
  }
  getUserData() {
    this.httpOptions = {
      headers: new HttpHeaders()
    };
    return this.get(
      `${Urls.GET_USER_DATA}?userEmail=${this.userEmail}`,
      this.httpOptions
    ).pipe(
      map((response: any) => {
        this.CompanyId = response.companyId;
        return response;
      })
    );
  }
  getfieldData(id) {
    const httpfieldOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/json',
        //  Authorization: this.tokenService.token,
        //  'Fieldid': id.id
        fieldId: id.id
      })
    };
    return this.get(`${Urls.GET_FIELD_DATA}`, httpfieldOptions).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getUserCompanyId() {
    return this.CompanyId;
  }
  getClientsConnectInfo(userId: string) {
    this.httpOptions = {
      headers: new HttpHeaders({
        userId: userId
      })
    };
    return this.get(
      `${Urls.GET_MKT_CLIENTS_CONNECT_INFO}`,
      // `${this.dataAccess_base_url}grants?user_id=${userId}`,
      this.httpOptions
    );
  }

  public get(url: string, options: any): Observable<any> {
    return this.http.get(url, options).pipe(map((response: any) => response));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an ErrorObservable with a user-facing error message
    return;
  }
}
