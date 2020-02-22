import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  public _componentsLoaded = new Subject();

  private _addWidget = new BehaviorSubject('');
  private _removeWidget = new BehaviorSubject('');
  private _openAddWidgetDialog = new BehaviorSubject('');
  private _wordWrapTooltip = new BehaviorSubject<number>(0);

  public addWidget$ = this._addWidget.asObservable();
  public removeWidget$ = this._removeWidget.asObservable();
  public openAddWidgetDialog$ = this._openAddWidgetDialog.asObservable();
  public wordWrapTooltip$ = this._wordWrapTooltip.asObservable();

  constructor() {
    this._componentsLoaded.next(false);
  }

  componentsLoaded(value: boolean) {
    if (value) {
      this._componentsLoaded.next(value);
    }
  }

  addWidget(id: string) {
    this._addWidget.next(id);
  }

  removeWidget(id: string) {
    this._removeWidget.next(id);
  }

  openAddWidgetDialog(event: string) {
    this._openAddWidgetDialog.next(event);
  }

  wordWrapTooltipId(id: number) {
    this._wordWrapTooltip.next(id);
  }
}
