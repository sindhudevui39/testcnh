import { BehaviorSubject, Observable } from 'rxjs';

export abstract class AbstractDataStore<T> {
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  protected list$: BehaviorSubject<T[]> = new BehaviorSubject([]);
  private _loading: boolean;

  constructor() {

    this._loading = false;
  }
  public get loading(): boolean {
    return this._loading;
  }

  public set loading(isLoading: boolean) {
    this._loading = isLoading;
    this.loading$.next(isLoading);
  }

  public getList(): Observable<T[]> {
    return this.list$;
    // .shareReplay(1);
  }

  public add(items: T[]): T[] {
    this.list$.next(items);
    return items;
  }

  public clear(): void {
    this.list$.next([]);
  }
}
