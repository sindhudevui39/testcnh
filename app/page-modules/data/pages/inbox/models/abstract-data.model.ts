import * as moment from 'moment';
import { Moment } from 'moment';

export abstract class AbstractData {
  public statusData: any = {
    style: {},
    active: false
  };

  protected uid: string;
  protected rawData: any;
  protected modifiedData: any = {};

  // Used to parse and format dates (default ISO, can be overridden)
  public dateFormat: string ;
  public get rawId(): number | string {
    return this.rawData.ID
      ? this.rawData.ID
      : this.rawData.id
        ? this.rawData.id
        : -1;
  }

  public set rawId(value: number | string) {
    this.preventedSet('rawId');
  }

  public get id(): string {
    if (!(this.resource && this.rawId)) {
      return this.uid;
    }
    return `${this.resource}_${this.rawId}`;
  }

  public set id(value: string) {
    this.preventedSet('id');
  }

  // modified to match AG-Integrated data
  public get name(): string {
    return this.rawData.Name
      ? this.rawData.Name
      : this.rawData.name
        ? this.rawData.name
        : null;
  }

  public set name(value: string) {
    this.modifiedData.name = value;
  }

  public get resource(): string {
    const resource = this.rawData.Type
      ? this.rawData.Type
      : this.rawData.resource
        ? this.rawData.resource
        : null;
    return resource ? resource.toLowerCase() : null;
  }

  public set resource(value: string) {
    this.preventedSet('resource');
  }

  public get creationDate(): Date {
    return this.getDate(
      this.rawData &&
        this.rawData.meta &&
        this.rawData.meta.creation &&
        this.rawData.meta.creation.date
    );
  }

  public get modificationDate(): Date {
    return this.getDate(
      this.rawData &&
        this.rawData.meta &&
        this.rawData.meta.lastModified &&
        this.rawData.meta.lastModified.date
    );
  }

  public get modified(): any {
    return this.modifiedData;
  }

  public set modified(value: any) {
    this.modifiedData = value;
  }

  constructor(rawData: any) {
    this.uid = Math.random().toString();
    this.statusData = {};
    this.dateFormat = 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]';
    if (rawData) {
      this.setData(rawData);
    }
  }

  public clone(item: any): this {
    this.rawData = item.rawData;
    return this;
  }

  public setData(rawData: any): this {
    this.rawData = rawData;
    return this;
  }

  public setStatus(statusData: any): void {
    this.statusData = statusData;
  }

  public mergeModified(data: any): void {
    this.modifiedData = Object.assign({}, this.modifiedData, data);
  }

  public clearModified(): void {
    this.modifiedData = null;
  }

  public isModified(): boolean {
    return !!this.modifiedData;
  }

  protected preventedSet(property: any) {
    throw new Error(`Not allowed to manually set ${property} for ${this.id}`);
  }

  protected getDate(date: string | number, format?: string): Date | null {
    let res: Date | null = null;
    const dateType = typeof date;

    if (!/number|string/.test(dateType)) {
      return res; // Exit early
    }

    if ('string' !== typeof format || format.length < 1) {
      format = this.dateFormat;
    }

    let m: Moment | null = null;

    if (format === 'unix' && 'number' === dateType) {
      // Unix timestamp (milliseconds)
      m = moment.utc(date);
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
