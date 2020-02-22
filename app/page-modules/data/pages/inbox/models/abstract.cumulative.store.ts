import { AbstractDataStore } from './abstract.store';

import { AbstractData } from './abstract-data.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
export abstract class AbstractCumulativeDataStore<
  T extends AbstractData
> extends AbstractDataStore<T> {
  protected listMap: Map<string | number, T> = new Map();

  public clear(): void {
    this.listMap.clear();
    this.list$.next(this.list);
  }

  private get list(): T[] {
    return Array.from(this.listMap.values());
  }
}
