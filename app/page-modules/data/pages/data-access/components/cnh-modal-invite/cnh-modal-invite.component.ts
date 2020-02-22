import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subject, Subscription } from 'rxjs';
import { DataAccessClientsService } from '../../services/data-access.services';
import { UserService } from '@services/user/user.service';
import { TranslateService } from '@ngx-translate/core';

export interface IModalInviteData {
  email: string;
  message: string;
  shareId: string | number;
  inviteId: string | number;
  inviteSent: boolean;
}
export interface ICreateSharePayload {
  inviteEmail: string;
  inviteMessage: string;
  sharedItems: any[];
  shareAll: boolean;
  shareFieldObjects: boolean;
  operations: any[];
  brand: string;
}
@Component({
  selector: 'cnh-modal-invite',
  templateUrl: './cnh-modal-invite.component.html',
  styleUrls: ['./cnh-modal-invite.component.css']
})
export class CnhModalInviteComponent implements OnInit, OnDestroy {
  public static readonly componentName: string = 'CnhModalDataAccessInvite';
  protected subscriptions: Set<Subscription> = new Set();
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  public title: string;
  public buttonText = this.translate.instant('GLOBAL.SEND');
  public cancelText = this.translate.instant('GLOBAL.CANCEL');
  public dataSent = false;
  public success = false;
  public loading = false;
  public sendReady = false;
  public emailError = false;
  public showSetupAccessIcon = false;
  public emailRegex = new RegExp('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}');

  public email = '';
  public message = '';
  public brand = '';
  private _shareId?: string | number;
  private _inviteId?: string | number;
  private _invitedEmails = [];
  private _UserEmailID = [];
  linkedUser: boolean;

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public constructor(
    private _dataAccessClientsService: DataAccessClientsService,
    private _dialogRef: MatDialogRef<CnhModalInviteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private readonly translate: TranslateService
  ) {
    this._dialogRef.disableClose = true;
  }

  public ngOnInit(): void {
    this.brand = this.userService['_user'].brand;
    if (this.data) {
      this.title = this.data.title;
      this.buttonText = this.data.confirmButton;
      this.cancelText = this.data.cancelLabel || this.translate.instant('GLOBAL.CANCEL');
    }
    this._dataAccessClientsService.getShareData().subscribe(data => {
      data.forEach(share => {
        this._invitedEmails.push(share.inviteEmail);
        this._invitedEmails.push(share.sender);
      });
      this._invitedEmails = this._invitedEmails
        .filter((v, i) => this._invitedEmails.indexOf(v) === i)
        .filter(function(el) {
          return el != null;
        });
    });
  }

  public onValueChange(event): void {
    const elName = event.target.name;
    this[elName] = event.target.value;
    if (elName === 'email') {
      if (this.data.email.toLowerCase() === this.email.toLowerCase()) {
        this.linkedUser = true;
        this.emailError = false;
        this.sendReady = false;
        return;
      }
      if (this._invitedEmails.filter(t => t.toLowerCase() == this.email.toLowerCase()).length > 0) {
        this.linkedUser = false;
        this.emailError = true;
        this.sendReady = false;
      } else {
        this.linkedUser = false;
        this.emailError = false;
        this.sendReady = this.emailRegex.test(this.email);
      }
    }
  }

  public onSubmit(): void {
    if (!this.dataSent) {
      this._sendData();
    } else {
      if (this.success) {
        // TODO: open data access setup
        this._closeDialog(true);
      } else {
        // Retry
        this._sendData();
      }
    }
  }

  public onCancel(): void {
    if (!this.success && this.dataSent) {
      this.dataSent = false;
    } else {
      this._closeDialog(false);
    }
  }

  private _sendData(): void {
    const payload: ICreateSharePayload = {
      inviteEmail: this.email,
      inviteMessage: this.message,
      sharedItems: [],
      shareAll: false,
      shareFieldObjects: false,
      operations: [],
      brand: this.userService['_user'].brand
    };
    this.loading = true;
    this.dataSent = true;

    this._dataAccessClientsService.createShare(payload).subscribe(
      async res => {
        if (res && res.id) {
          this._shareId = res.id;
          try {
            this._dataAccessClientsService.getinviteId(this._shareId).subscribe(share => {
              if (share[0] && share[0].inviteId) {
                this._inviteId = share[0].inviteId;
              }
            });
          } catch (_) {
            /* Empty */
          }
        }

        this.loading = false;
        this.success = true;
        this.buttonText = this.translate.instant('INVITE.SETUP_CTA');
        this.cancelText = this.translate.instant('INVITE.SETUP_LATER');
        this.showSetupAccessIcon = true;
      },
      () => {
        this.loading = false;
        this.success = false;
        this.buttonText = this.translate.instant('INVITE.TRY_AGAIN');
        this.cancelText = this.translate.instant('INVITE.GO_BACK');
      }
    );
  }

  private _closeDialog(response: boolean): void {
    const ret = {
      response: this.success && response, // setup data yes/no
      payload: {
        email: this.email,
        message: this.message,
        shareId: this._shareId,
        inviteId: this._inviteId,
        inviteSent: this.success
      }
    };
    this._dialogRef.close(ret);
  }
}
