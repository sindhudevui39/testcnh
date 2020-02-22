import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, Subject, Subscription, of } from 'rxjs';
import { map, shareReplay, skip, startWith, switchMap, takeUntil } from 'rxjs/operators';
import * as _ from 'underscore';
import * as moment from 'moment';
import { DataAccessClientsService } from '../../services/data-access.services';
import { Moment } from 'moment';
import { UserService } from '@services/user/user.service';
import {
  CnhModalComponent,
  IModalData,
  CnhThemeColor
} from '../../../Connections/components/cnh-modal/cnh-modal.component';
import { CnhTrowserService } from '../../services/data-access-setup-service';
import { CnhTrowserDataSharingComponent } from '../../layouts/cnh-trowser-data-sharing/cnh-trowser-data-sharing.component';
import { CnhSnackBarService } from '../../services/cnh-snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '@services/util/util.service';

export enum IDataAccessEvents {
  SELECT_DATA = 'SELECT_DATA',
  REVOKE_DATA = 'REVOKE_DATA'
}

@Component({
  selector: 'cnh-page-my-data-access',
  templateUrl: './cnh-page-my-data-access.component.html',
  styleUrls: ['./cnh-page-my-data-access.component.css']
})
export class CnhPageMyDataAccessComponent implements OnInit, OnDestroy {
  // @Language() public lang: string;
  protected subscriptions: Set<Subscription> = new Set();
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  public brand: string;
  public partnersLoading$: Observable<boolean>;
  public partnerId$: Observable<string | number>;
  public activePartner: any;
  public isPartner: boolean;
  public activeShare$: Observable<any>;
  public editShareData: any = {};
  public activeFieldDataCreatedAt;
  public activeShareId: string;
  public isDataShareDisabled = false;
  public dropdownMenuItems: any[];

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public constructor(
    private _activatedRoute: ActivatedRoute,
    private _dialog: MatDialog,
    private _dataAccessClientsService: DataAccessClientsService,
    private _router: Router,
    private _trowserService: CnhTrowserService,
    private userService: UserService,
    private readonly translate: TranslateService,
    private _snackBarService: CnhSnackBarService,
    private _utilService: UtilService
  ) {}
  public ngOnInit(): void {
    this.brand = this.userService['_user'].brand;
    this.dropdownMenuItems = [
      {
        id: IDataAccessEvents.REVOKE_DATA,
        label: 'DATA_ACCESS.REVOKE_ACCESS'
      }
    ];

    this.partnerId$ = this._activatedRoute.paramMap.pipe(
      map((paramMap: ParamMap) => paramMap.get('partnerId')),
      startWith(null),
      shareReplay(1)
    );

    const activePartner$: Observable<any> = this.partnerId$.pipe(
      switchMap((partnerId: string) => {
        this._dataAccessClientsService.setRouteId(partnerId);
        return this._dataAccessClientsService
          .getFilteredList(partner => partner && partner.id === partnerId)
          .pipe(
            map((foundPartners: any[]) => {
              if (foundPartners && foundPartners.length > 0) {
                return foundPartners[0];
              }

              return null;
            })
          );
      })
    );

    activePartner$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(partner => {
      this.activePartner = partner || null;
      this.isPartner = this.activePartner && this.activePartner.invitationStatus === 'ACCEPTED';
    });

    this.activeShare$ = activePartner$.pipe(
      switchMap(partner => {
        if (partner) {
          return this._dataAccessClientsService.getSentByInviteId(
            partner.id,
            this._dataAccessClientsService.getUserCompanyId()
          );
        } else {
          return of(null);
        }
      })
    );

    this.activeShare$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(share => {
      this._checkIsDataShareDisabled(share);
      if (share && share.createdAt) {
        this.editShareData = share;
        this.activeShareId = share.rawId + '';

        let momentDate: Moment;
        if (this._utilService.getTimezoneOffset()) {
          momentDate = moment(share.createdAt).utcOffset(this._utilService.getTimezoneOffset());
        } else {
          momentDate = moment(share.createdAt);
        }
        this.translate
          .get('DATA_ACCESS.SHARE_CARD.GRANTED_ON', {
            date: momentDate.format(this.userService.getTimeFormat())
          })
          .subscribe((res: string) => {
            this.activeFieldDataCreatedAt = res;
          });
      }
    });
  }

  public onContentAction(event) {
    switch (event) {
      case IDataAccessEvents.SELECT_DATA:
        // this.handleSelectData();
        break;
      case IDataAccessEvents.REVOKE_DATA:
        this.revokeData();
        break;
    }
  }

  public handleSelectData() {
    this._trowserService.createTrowser({
      title: this.translate.instant('DATA_ACCESS.SETUP'),
      contentComponent: CnhTrowserDataSharingComponent,
      data: {
        partner: this.activePartner,
        shareId: this.activeShareId
      }
    });
  }
  public editData() {
    this._trowserService.createTrowser({
      title: this.translate.instant('DATA_ACCESS.SETUP'),
      contentComponent: CnhTrowserDataSharingComponent,
      data: {
        partner: this.activePartner,
        shareId: this.activeShareId,
        shareData: this.editShareData
      }
    });
  }
  public async revokeData(): Promise<void> {
    if (this.activePartner) {
      let ContentLabel;
      this.translate
        .get('DATA_ACCESS.REVOKE_ACCESS_MODAL.CONTENT', {
          company: this.activePartner.name || this.activePartner.email
        })
        .subscribe((res: string) => {
          ContentLabel = res;
        });

      const modalData: IModalData = {
        cancelLabel: this.translate.instant('INVITE.GO_BACK'),
        confirmColor: CnhThemeColor.PRIMARY,
        confirmLabel: this.translate.instant('DATA_ACCESS.REVOKE'),
        contentText: ContentLabel,
        disableClose: false,
        iconName: 'warning-2',
        header: this.translate.instant('DATA_ACCESS.REVOKE_ACCESS_MODAL.TITLE'),
        name: 'cnhDataAccess_revokeDataConfirm'
      };

      this._dialog
        .open(CnhModalComponent, {
          data: modalData,
          width: '540px',
          autoFocus: false
        })
        .afterClosed()
        .subscribe(
          data => {
            if (data && data.response) {
              return this._dataAccessClientsService
                .removeAllShares(this.activePartner.rawId)
                .subscribe(
                  () => {
                    this._dataAccessClientsService.getDataAccess().subscribe();
                    this._snackBarService.open(
                      this.translate.instant('DATA_ACCESS.REVOKE_ACCESS_SUCCESS')
                    );
                  },
                  () => {}
                );
            }
          },
          error => console.error(error)
        );
    }
  }
  private _checkIsDataShareDisabled(share): void {
    this.isDataShareDisabled =
      !share ||
      (share &&
        !share.shareAll &&
        !share.shareFieldObjects &&
        (!share.sharedItems || (Array.isArray(share.sharedItems) && !share.sharedItems.length)) &&
        (!share.operations || (Array.isArray(share.operations) && !share.operations.length)));
  }
}
