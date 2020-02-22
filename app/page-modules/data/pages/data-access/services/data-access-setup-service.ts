import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  InjectionToken,
  Injector,
  ReflectiveInjector,
} from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';
import { MatDialogConfig } from '@angular/material';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { CnhTrowserComponent } from '../layouts/data-access-setup/data-access-setup';
import { DataAccessClientsService } from '../services/data-access.services';
// import { TokenService } from '../../../services/token/token.service';
import { Urls } from '@enums/urls.enum';
import { map } from 'rxjs/operators';
interface ITrowserArgs {
  title: string;
  contentComponent: any;
  modalConfig?: MatDialogConfig;
  data?: any;
}

export const TROWSER_DATA = new InjectionToken<string>('TROWSER_DATA');

@Injectable()
export class CnhTrowserService {
  // private httpOptions: any;
  public isOpen$: Observable<boolean>;
  public fieldRemove: BehaviorSubject<any[]> = new BehaviorSubject([]);
  private _trowserComponentRef: ComponentRef<CnhTrowserComponent>;
  private _trowserElement: HTMLElement;
  private _isOpenValue: boolean;
  private _isOpenSubject = new BehaviorSubject<boolean>(false);
  private _trowserCloseSubscription: Subscription = null;
  public stepValue: number;
  public constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _applicationRef: ApplicationRef,
    private _injector: Injector,
    private _dataAccessClientsService: DataAccessClientsService,
    // private _tokenservice: TokenService,
    private http: HttpClient
  ) {
    this._isOpenValue = false;
    this.stepValue = 0;
    this.isOpen$ = this._isOpenSubject.asObservable();
  }

  public createTrowser({
    title,
    contentComponent,
    modalConfig,
    data
  }: ITrowserArgs) {
    // t trower if already open
    if (this._trowserComponentRef || this._trowserElement) { this.destroyTrowser(); }
    // Adds custom data to injector
    const newInjector = ReflectiveInjector.resolveAndCreate(
      [ {provide: TROWSER_DATA, useValue: data || null} ],
      this._injector
    );
    // Creates trowser component and adds it to DOM and Angular
    this._trowserComponentRef = this._componentFactoryResolver.resolveComponentFactory(CnhTrowserComponent).create(newInjector);
    this._trowserElement = this._trowserComponentRef.location.nativeElement as HTMLElement;
    this._trowserComponentRef.instance.contentComponent = contentComponent;
    this._trowserComponentRef.instance.title = title;
    this._trowserComponentRef.instance.modalConfig = modalConfig;
    document.body.appendChild(this._trowserElement);
    this._applicationRef.attachView(this._trowserComponentRef.hostView);
    this._setOpenStatus(true);
    // Subscribes to trowser close event to destroy it
    this._trowserCloseSubscription = this._trowserComponentRef.instance.onDestroy
      .subscribe(() => this.destroyTrowser());
  }
  setStepValue(value) {
    this.stepValue = value;
  }
  getStepValue() {
    return this.stepValue;
  }
  getDataFields() {
    // return this.http.get('./assets/sample.json').pipe(
   return this.http.get(`${Urls.GET_FIELDS}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  public confirmExit(toggle: boolean) {
    if (
      this._isOpenValue &&
      this._trowserComponentRef.instance.modalConfig
    ) {
      this._trowserComponentRef.instance.confirmExit = !!toggle;
    }

  }

  public destroyTrowser(): void {
    if (!this._isOpenValue) {
      return;
    }

    if (this._trowserComponentRef.instance.confirmExit) {
      this._trowserComponentRef.instance.showModal();
    } else {
      this._applicationRef.detachView(this._trowserComponentRef.hostView);
      this._trowserComponentRef.destroy();
      this._trowserCloseSubscription.unsubscribe();
      this._trowserCloseSubscription = null;
      this._trowserComponentRef = null;
      this._trowserElement = null;
      this._setOpenStatus(false);
    }
  }
  public changeFieldValue(fields) {
    this.fieldRemove.next([fields]);

  }
  private _setOpenStatus(isOpen: boolean): void {
    this._isOpenSubject.next(isOpen);
    this._isOpenValue = isOpen;
  }

}

