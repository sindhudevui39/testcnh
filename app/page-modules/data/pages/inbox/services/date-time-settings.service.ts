import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
export interface IDateTimeSettings {
  date: string;
  time: string;
}

@Injectable()
export class DateTimeSettingsService {
  public dateFormat$: Observable<string>;
  public timeFormat$: Observable<string>;
  public datetimeFormat$: Observable<string>;

  private dateFormatSubject: BehaviorSubject<string>;
  private timeFormatSubject: BehaviorSubject<string>;
  private defaultStyle: IDateTimeSettings = {
    date: 'MM/DD/YYYY',
    time: 'h:mm A'
  };
  private static dateTime(settings: IDateTimeSettings): string {
    return `${settings.date} ${settings.time}`;
  }

  public constructor() {
    this.timeFormatSubject = new BehaviorSubject(this.defaultStyle.time);
    this.dateFormatSubject = new BehaviorSubject(this.defaultStyle.date);
    this.datetimeFormat$ = combineLatest(
      this.dateFormatSubject,
      this.timeFormatSubject
    ).pipe(
      map(([date, time]) => DateTimeSettingsService.dateTime({ date, time }))
    );

    this.timeFormat$ = this.timeFormatSubject.asObservable();
    this.dateFormat$ = this.dateFormatSubject.asObservable();
  }

  public setTimeFormat(time: string) {
    this.timeFormatSubject.next(time);
  }

  public getTimeFormat(): string {
    return this.timeFormatSubject.getValue();
  }

  public setDateFormat(date: string) {
    this.dateFormatSubject.next(date);
  }

  public getDateFormat(): string {
    return this.dateFormatSubject.getValue();
  }

  public getDateTimeFormat(): string {
    return DateTimeSettingsService.dateTime({
      date: this.getDateFormat(),
      time: this.getTimeFormat()
    });
  }

  public setDateTimeStyle(datetime: string) {
    const style = this.generateDateTimeSettings(datetime);
    this.dateFormatSubject.next(style.date);
    this.timeFormatSubject.next(style.time);
  }

  // NOTE: this function generate the DatetimeSettings object based on api response.
  // All logic must be added here.
  private generateDateTimeSettings(format: string): IDateTimeSettings {
    // NOTE: the split char used is @. for example: DD/MM/YYYY@H:mm
    let formatString = 'MM/DD/YYYY@h:mm A';
    if (typeof format === 'string' && format.indexOf('@') >= 0) {
      formatString = format;
    }
    const [date, time] = formatString.split('@');
    return { date, time };
  }
}
