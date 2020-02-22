import {
  AfterContentInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  Injector,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DataAccessClientsService } from '../../services/data-access.services';
import {
  CnhModalComponent,
  IModalData,
  CnhThemeColor
} from '../../../Connections/components/cnh-modal/cnh-modal.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'data-access-setup',
  templateUrl: './data-access-setup.html',
  styleUrls: ['./data-access-setup.css']
})
export class CnhTrowserComponent implements OnInit, AfterContentInit {
  public title: string;
  public contentComponent: any = null;
  public modalConfig: MatDialogConfig<IModalData> = null;
  public confirmExit: boolean;
  public onDestroy: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('content', { read: ViewContainerRef })
  private _contentViewContainerRef: ViewContainerRef;
  private _contentComponentRef: ComponentRef<any>;

  public constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _injector: Injector,
    private _dialog: MatDialog,
    private _dataAccessClientsService: DataAccessClientsService,
    private readonly translate: TranslateService
  ) {
    // Empty
  }

  public ngOnInit(): void {
    this.confirmExit = false;
    this.title = this.translate.instant('DATA_ACCESS.SETUP');
    // Empty
  }

  public ngAfterContentInit(): void {
    if (this.contentComponent) {
      const contentFactory = this._componentFactoryResolver.resolveComponentFactory(
        this.contentComponent
      );
      this._contentComponentRef = this._contentViewContainerRef.createComponent(
        contentFactory,
        0,
        this._injector
      );
    }
  }
  removeModelPopup() {
    if (
      this._dataAccessClientsService.getStepValue() === 0 ||
      this._dataAccessClientsService.getStepValue() === 3
    ) {
      this.closeTrowser();
    } else {
      const modalData: IModalData = {
        cancelLabel: this.translate.instant('INVITE.GO_BACK'),
        confirmColor: CnhThemeColor.PRIMARY,
        confirmLabel: this.translate.instant('GLOBAL.EXIT'),
        contentText: this.translate.instant('INVITE.EXIT_DATA_LOSS'),
        iconName: 'warning-2',
        header: this.translate.instant('INVITE.EXIT_DATA_LOSS_HEADER'),
        name: 'cnhDataAccess_confirmPartnerRemoval'
      };

      this._dialog
        .open(CnhModalComponent, {
          data: modalData,
          width: '400px',
          autoFocus: false
        })
        .afterClosed()
        .subscribe(
          data => {
          if (data && data.response) {
            this.closeTrowser();
          }
        },
       error => console.error(error)
      )
    }
  }
  public closeTrowser(): void {
    if (!this.confirmExit) {
      this.destroyTrowserContent();
      this.onDestroy.emit();
      return;
    }

    this.showModal();
  }

  public showModal(): void {
    this._dialog.open(CnhModalComponent, this.modalConfig);
  }

  private destroyTrowserContent(): void {
    if (this._contentComponentRef) {
      this._contentComponentRef.destroy();
      this._contentComponentRef = null;
    }
  }
}
