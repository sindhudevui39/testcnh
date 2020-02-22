import { Injectable } from '@angular/core';
import { Urls } from '../../../../../shared/enums/urls.enum';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';
import { DataFile } from '../models/data-file.model';
import { map } from 'rxjs/operators';
import { UtilService } from '@services/util/util.service';
import { Moment } from 'moment';
import * as moment from 'moment';

@Injectable()
export class DataFileService {
  private httpOptions: any;
  httpopt: any;

  constructor(private http: HttpClient, private _utilService: UtilService) {}

  public get(type: number): Observable<DataFile[]> {
    let url = Urls.LAST_CREATED + '?type=Upload';
    // let url = './assets/inbox-user.json';
    if (type) {
      url = Urls.LAST_CREATED + '?type=Upload';
    }
    return this.http
      .get(url)
      .pipe(map((response: any) => response.Values))
      .pipe(
        map((files: any[]) =>
          files.map(file => {
            file['timeZone'] = this._utilService.getTimezoneOffset();
            file['size'] = this.size(file);
            file['fileName'] = this.fileName(file);
            file['FileSize'] = this.FileSize(file);
            file['creationDate'] = this.creationDate(file);
            file['source'] = this.source(file);
            file['extension'] = this.extension(file);
            file['bytesToSize'] = this.bytesToSize(file);
            file['namedDate'] = this.namedDate(file);
            // return new DataFile(file);
            return file;
          })
        )
      );
  }
  postSendFileTransfer(farmfielddata): Observable<Response> {
    const resData: Subject<Response> = new Subject<Response>();
    this.http
      .post(Urls.SEND_INBOX_FILE_TRANSFER, farmfielddata, {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      })
      .subscribe((res: Response) => {
        resData.next(res);
      });
    return resData.asObservable();
  }
  public downloadFiledata(url, filename): Observable<any> {
    this.httpOptions = {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders({
        url: url
      })
    };
    return this.http.get(`${Urls.GET_FILEDATA}`, this.httpOptions).pipe(map(res => res));
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
  public size(rawData): number {
    let bytes = 0;
    if (rawData.FileSize) {
      if (rawData.FileSize.includes('KB')) {
        bytes = Number(rawData.FileSize.replace('KB', '')) * 1024;
      } else if (rawData.FileSize.includes('MB')) {
        bytes = Number(rawData.FileSize.replace('MB', '')) * 1048576;
      }
    }
    return bytes;
  }

  public fileName(rawData): number {
    return rawData.FileName || null;
  }
  public FileSize(rawData): string {
    return rawData.FileSize || null;
  }

  public creationDate(rawData): Date {
    let timeZone = rawData.timeZone;
    if (!timeZone) {
      timeZone = '0000';
    }
    const CreatedTime = moment.utc(rawData.CreatedTime).utcOffset(timeZone);
    return this.getDate(CreatedTime.valueOf());
  }

  private userOwnerName(rawData): string {
    return rawData.userOwnerName || null;
  }

  private userOwnerSurname(rawData): string {
    return rawData.userOwnerSurname || null;
  }

  public source(rawData): string {
    if (rawData.SourceType) {
      if (rawData.SourceType === 'Grower') {
        return rawData['UserName'];
      } else if (rawData.SourceType === 'Vehicle') {
        return rawData['VehicleName'];
      } else {
        return rawData.SourceType;
      }
    } else {
      return rawData.Source;
    }
  }

  public extension(rawData): string {
    return rawData.extension || null;
  }

  public bytesToSize(rawData): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (rawData.size === 0) {
      return null;
    }
    const i: number = parseInt(String(Math.floor(Math.log(rawData.size) / Math.log(1024))), 10);
    if (i === 0) {
      return `${rawData.size} ${sizes[i]}`;
    }
    return `${(rawData.size / 1024 ** i).toFixed(1)} ${sizes[i]}`;
  }

  // @REFACTOR: find a better way to do this (gropBy namedDate). Should use momentLocale setting
  public namedDate(rawData): string {
    let timeZone = rawData.timeZone;
    if (!timeZone) {
      timeZone = '0000';
    }
    const reference: Moment = moment.utc(rawData.creationDate).utcOffset(timeZone);
    return reference.clone().calendar(moment.utc().utcOffset(timeZone), {
      sameDay: '[GLOBAL.TODAY]',
      lastDay: '[GLOBAL.THIS_WEEK]',
      lastWeek: '[GLOBAL.THIS_WEEK]',
      sameElse: (now: Moment) => {
        if (now.month() === reference.month() && now.year() === reference.year()) {
          return '[GLOBAL.THIS_MONTH]';
        } else if (now.month() - 1 === reference.month() && now.year() === reference.year()) {
          return '[GLOBAL.LAST_MONTH]';
        } else if (now.year() === reference.year()) {
          return '[GLOBAL.THIS_YEAR]';
        } else if (now.year() - 1 === reference.year()) {
          return '[GLOBAL.LAST_YEAR]';
        } else {
          return '[GLOBAL.OLDER]';
        }
      }
    });
  }

  getDate(date: string | number, format?: string): Date | null {
    let res: Date | null = null;
    const dateType = typeof date;
    if (!/number|string/.test(dateType)) {
      return res; // Exit early
    }

    if ('string' !== typeof format || format.length < 1) {
      format = 'unix';
    }

    let m: Moment | null = null;

    if (format === 'unix' && 'number' === dateType) {
      // Unix timestamp (milliseconds)
      let timeZone = this._utilService.getTimezoneOffset();
      if (!timeZone) {
        timeZone = '0000';
      }
      m = moment.utc(date).utcOffset(timeZone);
    } else if (format === 'unix-seconds' && 'number' === dateType) {
      // Unix timestamp (seconds)
      m = moment.unix(date as number);
    } else if ('string' === dateType && (date as string).length > 0) {
      // All dates are in UTC
      m = moment.utc(date, format);
    }

    if (m && m.isValid()) {
      // Convert to utc (ex. unix/unix-seconds)
      res = m.utc().toDate();
    }

    return res;
  }
}
