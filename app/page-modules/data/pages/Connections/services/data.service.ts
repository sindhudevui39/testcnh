import { Injectable } from '@angular/core';
// import { TokenService } from '../../../services/token/token.service';
import { Urls } from '../../../../../shared/enums/urls.enum';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import * as _ from 'underscore';
import { UserService } from '@services/user/user.service';
@Injectable()
export class DataClientsService {
  private httpOptions: any;
  userEmail: string;
  CompanyId: string;
  regionList: any;
  // private httpOptions1: any;
  // private clients_base_url: string = environment.clients_base_url;

  constructor(
    private http: HttpClient,
    private userService: UserService // , private tokenService: TokenService
  ) {
    this.regionList = this.http.get('./assets/regionlist/data.json').pipe(
      map((response: any) => {
        return response;
      }),
      shareReplay(1)
    );
    this.userEmail = userService['_user'].email;
  }
  getregionList() {
    return this.regionList;
  }

  getUserData() {
    return this.get(`${Urls.GET_USER_DATA}?userEmail=${this.userEmail}`, {}).pipe(
      map((response: any) => {
        this.CompanyId = response.companyId;
        return response;
      })
    );
  }
  getStatusOfUser(companyId) {
    this.httpOptions = {
      headers: new HttpHeaders({ companyId: companyId })
    };
    return this.get(`${Urls.GETSTATUSOFUSER}`, this.httpOptions).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getClients() {
    return this.get(`${Urls.GET_CLIENTS}`, {}).pipe(
      map((response: any) => {
        // client_id client_metadata logo_uri name description
        const responseValue = [];
        _.each(response, function(ValueTransformer, key) {
          responseValue.push(
            _.pick<any, any>(
              ValueTransformer,
              'client_id',
              'client_metadata',
              'logo_uri',
              'name',
              'description'
            )
          );
        });
        return responseValue;
      })
    );
  }
  getClientsConnectInfo(userId: string) {
    this.httpOptions = {
      headers: new HttpHeaders({
        userid: userId
      })
    };
    return this.get(`${Urls.GET_CLIENTS_CONNECT_INFO}`, this.httpOptions);
  }
  disconnectApp(grantid: string, userid: string) {
    this.httpOptions = {
      headers: new HttpHeaders({
        grantid: grantid,
        userid: userid
      })
    };
    return this.delete(`${Urls.DISCONNECT_APP}`, this.httpOptions);
  }
  disconnectClimateApp(companyID: string) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        companyID: companyID
      })
    };
    return this.delete(`${Urls.DISCONNECTCLIMATE_APP}`, this.httpOptions);
  }
  public get(url: string, options: any): Observable<any> {
    return this.http.get(url, options).pipe(map((response: any) => response));
  }
  public delete(url: string, options: any): Observable<any> {
    return this.http.delete(url, options).pipe(map((response: any) => response));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // return an ErrorObservable with a user-facing error message
    return;
  }
  public saveClimateToken(data) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(`${Urls.CLIMATE_SAVETOKEN}`, JSON.stringify(data), this.httpOptions);
  }
  public enableClimate() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(`${Urls.ENABLE_CLIMATE}`, this.httpOptions);
  }
  public disableClimate() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(`${Urls.DISABLE_CLIMATE}`, this.httpOptions);
  }
}
