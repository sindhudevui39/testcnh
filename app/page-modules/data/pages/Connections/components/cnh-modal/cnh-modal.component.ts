import { Component, Inject, OnInit, TrackByFunction } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { UserService } from '@services/user/user.service';
import { TranslateService } from '@ngx-translate/core';
export enum CnhThemeColor {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  WARN = 'warn'
}
export interface ICheckboxOption {
  checked: boolean;
  key: string | number;
  label: string;
  required?: boolean;
}
export interface IModalData {
  cancelLabel?: string;
  checkboxes?: ICheckboxOption[];
  confirmColor?: CnhThemeColor;
  confirmLabel?: string;
  contentText?: string;
  disableClose?: boolean;
  disableSubmit?: boolean;
  hasActions?: boolean;
  hasCancel?: boolean;
  hasForm?: boolean;
  hasHeaderBackground?: boolean;
  isConnect?: boolean;
  hasReducedText?: boolean;
  header?: string;
  iconColor?: CnhThemeColor;
  iconName?: string;
  // @NOTE: name is required
  name: string;
  startDisabled?: boolean;
  submitOnEnter?: boolean;
  title?: string;
}
export interface ICnhModalPayload {
  cancel?: boolean;
  close?: boolean;
  confirm?: boolean;
  checkboxes?: ICheckboxOption[];
}
@Component({
  selector: 'cnh-modal',
  templateUrl: './cnh-modal.component.html',
  styleUrls: ['./cnh-modal.component.css']
})
export class CnhModalComponent implements OnInit {
  public static defaultComponentName = 'cnhModal';
  public modalData: IModalData;
  public brand: string;
  public constructor(
    private _dialogRef: MatDialogRef<CnhModalComponent>,
    @Inject(MAT_DIALOG_DATA) _dialogData: Record<string, any>,
    private userService: UserService,
    private readonly translate: TranslateService
  ) {
    const {
      cancelLabel,
      checkboxes: _checkboxes,
      confirmColor: _confirmColor,
      confirmLabel,
      contentText,
      disableClose,
      disableSubmit,
      hasActions,
      hasCancel: _hasCancel,
      hasForm: _hasForm,
      hasHeaderBackground: _hasHeaderBackground,
      hasReducedText,
      header,
      isConnect,
      iconColor,
      iconName: _iconName,
      name,
      startDisabled,
      submitOnEnter,
      title,
      ...data
    } = _dialogData;
    const checkboxes: ICheckboxOption[] = Array.isArray(_checkboxes)
      ? _checkboxes.filter(checkbox => !!checkbox)
      : [];
    // @NOTE: hasForm false if not exactly true value (no other truthy values)
    const hasForm: boolean = _hasForm === true || checkboxes.length > 0;
    const themeColors: any[] = [];
    const iconName: string = 'string' === typeof _iconName && _iconName.length > 0 ? _iconName : '';
    const hasHeaderBackground: boolean =
      !iconName && 'boolean' === typeof _hasHeaderBackground ? _hasHeaderBackground : false;
    const confirmColor: CnhThemeColor = _confirmColor ? _confirmColor : 'primary';
    const hasCancel: boolean = typeof _hasCancel ? _hasCancel : true;
    this.modalData = {
      ...data,
      cancelLabel: cancelLabel || this.translate.instant('GLOBAL.CANCEL'),
      checkboxes,
      confirmColor,
      confirmLabel: confirmLabel || this.translate.instant('GLOBAL.CONFIRM'),
      contentText: contentText || '',
      disableClose: 'boolean' === typeof disableClose ? disableClose : false,
      disableSubmit: 'boolean' === typeof disableSubmit ? disableSubmit : false,
      hasActions: 'boolean' === typeof submitOnEnter ? submitOnEnter : true,
      hasCancel: 'boolean' === typeof hasCancel ? hasCancel : true,
      hasForm,
      isConnect: 'boolean' === typeof isConnect ? isConnect : false,
      hasReducedText: hasReducedText === true,
      header: 'string' === typeof header && header.length >= 0 ? header : '',
      iconColor: themeColors.includes(iconColor) ? iconColor : 'warn',
      iconName,
      name: name || CnhModalComponent.defaultComponentName,
      startDisabled: 'boolean' === typeof startDisabled ? startDisabled : false,
      submitOnEnter: 'boolean' === typeof submitOnEnter ? submitOnEnter : false,
      title: 'string' === typeof title && title.length > 0 ? title : ''
    };
    if (this.modalData.disableClose) {
      this._dialogRef.disableClose = true;
    }
  }
  public ngOnInit(): void {
    // Empty
    this.brand = this.userService['_user'].brand;
  }
  public trackByKey: TrackByFunction<ICheckboxOption> = (index, checkbox) =>
    (checkbox && checkbox.key) || index;
  public onCancel(): void {
    this._returnRes({
      response: false,
      payload: {
        cancel: true
      }
    });
  }
  public onConfirm(): void {
    if (this.modalData.isConnect) {
      if (this.modalData['app'] && this.modalData['app'].client_metadata) {
        window.open(this.modalData['app'].client_metadata.landing_page, '_blank');
      }
    }
    this._returnRes({
      response: true,
      payload: {
        confirm: true,
        checkboxes: this.modalData.checkboxes
      }
    });
  }
  public onClose(): void {
    this._returnRes({
      response: false,
      payload: {
        close: true
      }
    });
  }
  private _returnRes(res): void {
    this._dialogRef.close(res);
  }
}
