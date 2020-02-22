import { Injectable } from '@angular/core';
import { Urls } from '@enums/urls.enum';
import { BehaviorSubject } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private companyIdChange = new BehaviorSubject('');
  public CompanyIdChange$ = this.companyIdChange.asObservable();
  private refreshFarmList = new BehaviorSubject(false);
  public refreshFarmList$ = this.refreshFarmList.asObservable();
  private openheaderNotification = new BehaviorSubject(false);
  public openheaderNotification$ = this.openheaderNotification.asObservable();
  public resetTab = new BehaviorSubject(false);
  public resetTab$ = this.resetTab.asObservable();

  constructor(private http: HttpClient) {}
  uploadData: any;
  public updateFileUpload$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public updateFiletrackingId$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public getNotification() {
    return this.http.get(`${Urls.FILE_NOTIFICATIONS}`).pipe(
      // return this.http.get('./assets/data.json').pipe(
      map(data => {
        return data;
      }),
      shareReplay(1)
    );
  }
  public setCompanyId(CompanyID) {
    this.companyIdChange.next(CompanyID);
  }
  public gotSuccessFromAPI() {
    this.refreshFarmList.next(true);
  }
  uploadFile(formData, fileName) {
    this.openheaderNotification.next(true);
    const headers: HttpHeaders = new HttpHeaders();
    /** In Angular 5, including the header Content-Type can invalidate your request */
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    const randomid = Math.random();
    this.updateFileUpload$.next({
      Name: fileName,
      RandomId: randomid,
      StatusCode: 20,
      PercentComplete: 0,
      Type: 'FileUpload'
    });
    this.uploadData = this.http.post(`${Urls.UPLOAD_TASK_FILE}`, formData, { headers }).pipe(
      map(data => {
        this.updateFiletrackingId$.next({
          Name: fileName,
          RandomId: randomid,
          TrackingCode: data['trackingCode']
        });
      }),
      shareReplay(1)
    );
    this.uploadData.subscribe();
  }
}
