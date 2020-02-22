import * as moment from 'moment';
import { AbstractData } from './abstract-data.model';
import { Moment } from 'moment';

export class DataFile extends AbstractData {
  constructor(rawData: any) {
    super(rawData);

    this.dateFormat = 'unix';
  }

  public get size(): number {
    let bytes = 0;
    if (this.rawData.FileSize) {
      if (this.rawData.FileSize.includes('KB')) {
        bytes = Number(this.rawData.FileSize.replace('KB', '')) * 1024;
      } else if (this.rawData.FileSize.includes('MB')) {
        bytes = Number(this.rawData.FileSize.replace('MB', '')) * 1048576;
      }
    }
    return bytes;
  }

  public get fileName(): number {
    return this.rawData.FileName || null;
  }
  public get UserFullName(): number {
    return this.rawData.UserFullName || null;
  }
  public get UserEmail(): number {
    return this.rawData.UserEmail || null;
  }
  public get FileSize(): string {
    return this.rawData.FileSize || null;
  }

  public get creationDate(): Date {
    let timeZone = this.rawData.timeZone;
    if (!timeZone) {
      timeZone = '0000';
    }
    const CreatedTime = moment.utc(this.rawData.CreatedTime).utcOffset(timeZone);
    return this.getDate(CreatedTime.valueOf());
  }

  public get UserType(): string {
    return this.rawData.UserType || null;
  }

  private get userOwnerSurname(): string {
    return this.rawData.userOwnerSurname || null;
  }
  public get FileUrl(): string {
    return this.rawData.FileUrl || null;
  }

  public get source(): string {
    return this.rawData.source || null;
    // if (this.rawData.SourceType) {
    //   if (this.rawData.SourceType === 'User') {
    //     return this.rawData['Source'];
    //   } else if (this.rawData.SourceType === 'Vehicle') {
    //     return this.rawData['Source'];
    //   } else {
    //     return this.rawData.Source;
    //   }
    // } else {
    //   return this.rawData.Source;
    // }
  }

  public get extension(): string {
    return this.rawData.extension || null;
  }

  public get bytesToSize(): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (this.size === 0) {
      return null;
    }
    const i: number = parseInt(String(Math.floor(Math.log(this.size) / Math.log(1024))), 10);
    if (i === 0) {
      return `${this.size} ${sizes[i]}`;
    }
    return `${(this.size / 1024 ** i).toFixed(1)} ${sizes[i]}`;
  }

  // @REFACTOR: find a better way to do this (gropBy namedDate). Should use momentLocale setting
  public get namedDate(): string {
    let timeZone = this.rawData.timeZone;
    if (!timeZone) {
      timeZone = '0000';
    }
    const reference: Moment = moment.utc(this.creationDate).utcOffset(timeZone);
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
}
