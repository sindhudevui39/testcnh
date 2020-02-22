import { Injectable } from '@angular/core';
import { DateTimeSettingsService } from '../services/date-time-settings.service';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Observable, empty, combineLatest } from 'rxjs';
import { map, filter } from 'rxjs/operators';

export type MomentDateOrNow = Date | undefined | void;
export type MomentDateFuture =
  | MomentDateOrNow
  | Promise<MomentDateOrNow>
  | Observable<MomentDateOrNow>;

@Injectable()
export class MomentLocaleService {
  public ISOString: typeof MomentLocaleService.ISOString;

  constructor(private dateTimeSettings: DateTimeSettingsService) {
    //
  }

  public static ISOString(date: Date): string | void | undefined {
    if (date && date instanceof Date) {
      return date.toISOString();
    }
  }

  public formatDate(
    date?: MomentDateOrNow,
    format: string = this.dateTimeSettings.getDateFormat()
  ): string | void | undefined {
    const momentObj: Moment = moment(date);

    if (momentObj && momentObj.isValid()) {
      return momentObj.format(format);
    }
  }

  public formatTime(
    date?: MomentDateOrNow,
    format: string = this.dateTimeSettings.getTimeFormat()
  ): string | void | undefined {
    const momentObj: Moment = moment(date);

    if (momentObj && momentObj.isValid()) {
      return momentObj.format(format);
    }
  }

  public formatDatetime(
    date?: MomentDateOrNow,
    format: string = this.dateTimeSettings.getDateTimeFormat()
  ): string | void | undefined {
    const momentObj: Moment = moment(date);

    if (momentObj && momentObj.isValid()) {
      return momentObj.format(format);
    }
  }

  public getFormattedDate$(date: MomentDateFuture): Observable<string> {
    if (
      !date ||
      !(
        date instanceof Date ||
        date instanceof Observable ||
        date instanceof Promise
      )
    ) {
      return empty();
    }

    return combineLatest(
      date instanceof Date ? [date] : date, // [Date] | Observable<Date> | Promise<Date>
      this.dateTimeSettings.dateFormat$
    )
      .pipe(map(([d, dateFormat]) => this.formatDate(d, dateFormat)))
      .pipe(filter(str => !!str)) as Observable<string>;
  }

  public getFormattedTime$(date: MomentDateFuture): Observable<string> {
    if (
      !date ||
      !(
        date instanceof Date ||
        date instanceof Observable ||
        date instanceof Promise
      )
    ) {
      return empty();
    }

    return combineLatest(
      date instanceof Date ? [date] : date, // [Date] | Observable<Date> | Promise<Date>
      this.dateTimeSettings.timeFormat$
    )
      .pipe(map(([d, timeFormat]) => this.formatTime(d, timeFormat)))
      .pipe(filter(str => !!str)) as Observable<string>;
  }

  public getFormattedDatetime$(date: MomentDateFuture): Observable<string> {
    if (
      !date ||
      !(
        date instanceof Date ||
        date instanceof Observable ||
        date instanceof Promise
      )
    ) {
      return empty();
    }

    return combineLatest(
      date instanceof Date ? [date] : date, // [Date] | Observable<Date> | Promise<Date>
      this.dateTimeSettings.datetimeFormat$
    )
      .pipe(
        map(([d, datetimeFormat]) => this.formatDatetime(d, datetimeFormat))
      )
      .pipe(filter(str => !!str)) as Observable<string>;
  }
}

MomentLocaleService.prototype.ISOString = MomentLocaleService.ISOString;
