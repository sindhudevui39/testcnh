import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CnhModalInviteComponent } from './components/cnh-modal-invite/cnh-modal-invite.component';
import * as _ from 'underscore';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DataAccessClientsService } from './services/data-access.services';
import { forkJoin, BehaviorSubject } from 'rxjs';
import { map, combineLatest } from 'rxjs/operators';
import { CnhTrowserService } from './services/data-access-setup-service';
import { CnhTrowserDataSharingComponent } from './layouts/cnh-trowser-data-sharing/cnh-trowser-data-sharing.component';
import { UserService } from '@services/user/user.service';
import { TranslateService } from '@ngx-translate/core';
import {
  CnhModalComponent,
  ICnhModalPayload,
  IModalData,
  CnhThemeColor
} from '../Connections/components/cnh-modal/cnh-modal.component';
import { CnhSnackBarService } from './services/cnh-snack-bar.service';
import { error } from '@angular/compiler/src/util';

export enum ShareStatus {
  UNKNOWN = '__Unknown_Share_Status__',
  PENDING = 'Pending',
  ACCEPTED = 'Accepted'
}
@Component({
  selector: 'app-data-access',
  templateUrl: './data-access.component.html',
  styleUrls: ['./data-access.component.css']
})
export class DataAccessComponent implements OnInit {
  toggleSidebar: boolean;
  public brand: string;
  public tabs: Array<any> = [];
  public searchValue = '';
  public partnerDetails: Array<any> = [];
  public filterBasedonTabSelection: Array<any> = [];
  public sortAndFilterpartnerDetails: Array<any> = [];
  public expanded = true;
  isLoading = false;
  sortPosition = true;
  public sortingOrder;
  userDataFormProfile: any;
  public seletedItem: any = {};
  checkDataEmpty = false;
  showpartnerPageStart = false;
  public routeId: string = null;
  someTooltipHide: number;
  protected list$: BehaviorSubject<any[]> = new BehaviorSubject([]);
  searchIconColor: boolean;
  userData: any;
  public constructor(
    private _dialog: MatDialog,
    private _router: Router,
    private _dataAccessClientsService: DataAccessClientsService,
    private _activatedRoute: ActivatedRoute,
    private _trowserService: CnhTrowserService,
    private userService: UserService,
    public readonly translate: TranslateService,
    private _snackBarService: CnhSnackBarService
  ) {
    this.translate.setDefaultLang('en');
  }

  public onLeftToggleClick(): void {
    this.expanded = !this.expanded;
  }

  ngOnInit() {
    if (sessionStorage.getItem('invite-token')) {
      this._dataAccessClientsService
        .postInviteId(sessionStorage.getItem('invite-token'))
        .subscribe(data => {
          this.callPartnerDate();
        });
    }
    this.toggleSidebar = true;
    this.searchIconColor = true;
    this.translate.use(this.userService.getUserPreferredLang());
    this.brand = this.userService['_user'].brand;
    this._dataAccessClientsService.Isloading$.subscribe(value => {
      this.isLoading = value;
    });
    this.tabs = [
      {
        disabled: false,
        titleKey: 'DATA_ACCESS.MY_DATA',
        routePath: 'my-data',
        active: this._router.url.indexOf('my-data') > -1
      },
      {
        disabled: false,
        titleKey: 'DATA_ACCESS.SHARED_WITH_ME',
        routePath: 'partner-data',
        active: this._router.url.indexOf('partner-data') > -1
      }
    ];
    this.callPartnerDate();
    this._dataAccessClientsService.routeId$.subscribe(value => {
      if (value) {
        if (
          !(this.seletedItem && this.seletedItem.id) ||
          (this.seletedItem && this.seletedItem.id !== value)
        ) {
          const foundPartner = this.sortAndFilterpartnerDetails.findIndex(
            partner => partner && partner.id === value
          );

          if (foundPartner > -1) {
            setTimeout(() => {
              this.onClick(foundPartner);
            }, 500);
          }
        }
      }
    });
    this._dataAccessClientsService.listfromAPI$.subscribe(value => {
      // this.seletedItem = {};
      if (value.length === 0 && this.checkDataEmpty) {
        this.showpartnerPageStart = true;
      } else {
        this.showpartnerPageStart = false;
      }
      if (!this.checkDataEmpty) {
        this.checkDataEmpty = true;
      }
      this.filterlistoutJson(value);
    });
  }
  blurFocusChange(booleanValue: boolean) {
    this.searchIconColor = booleanValue;
  }
  callPartnerDate() {
    this.seletedItem = {};

    forkJoin([
      this._dataAccessClientsService.getDataAccess(),
      this._dataAccessClientsService.getUserData()
    ]).subscribe(res => {
      if (res[0].length === 0) {
        this.showpartnerPageStart = true;
      } else {
        this.showpartnerPageStart = false;
      }
      this.userData = res[1].email;
      this.filterlistoutJson(res[0]);
      return true;
    });
  }
  mosueEntired() {
    this.someTooltipHide = 0;
    setTimeout(() => {
      this.someTooltipHide = 1500;
    }, 1500);
  }
  filterlistoutJson(shares) {
    const partners: Map<string, any> = new Map<string, any>();

    for (let i = 0; i < shares.length; i++) {
      const share = shares[i];
      if (share) {
        const isSharedByMe =
          this._dataAccessClientsService.getUserCompanyId() ===
          share.sharedByCompanyId;
        const partnerName = isSharedByMe
          ? share.sharedToCompanyName
          : share.sharedByCompanyName;
        const hasParentShare = !!share.parentShareId;
        const idString: string =
          share.inviteId &&
          share.inviteId.toString &&
          share.inviteId.toString();
        if (idString) {
          if (!partners.has(idString)) {
            const partnerCompanyId = isSharedByMe
              ? share.sharedToCompanyId
              : share.sharedByCompanyId;
            const partnerEmail = isSharedByMe
              ? share.inviteEmail
              : share.sender;

            partners.set(idString, {
              id: share.inviteId,
              companyId: partnerCompanyId,
              email: !hasParentShare ? partnerEmail : share.sender,
              name: partnerName,
              invitationStatus: share.status,
              parentShareId: share.parentShareId,
              rawId: share.id
            });
          }
        }
      }
    }

    _.each(Array.from(partners.values()), function(partner, key) {
      partner.isPendingInvitation =
        partner.invitationStatus === ShareStatus.PENDING;
      partner.title = partner.name ? partner.name : partner.email;
      partner.displayTitle = partner.title;
      const tag = document.createElement('div');
      tag.style.position = 'absolute';
      tag.style.left = '-99in';
      tag.style.whiteSpace = 'nowrap';
      tag.style.font = 'bold 14px Roboto';
      tag.innerHTML = partner.displayTitle;

      document.body.appendChild(tag);

      const result = tag.clientWidth;

      document.body.removeChild(tag);
      partner.showTooltip = result > 252;
      // if (partner.title.length > 33) {
      //   const totalCharAllowed = 28;
      //   const emailname = partner.title.substring(
      //     0,
      //     partner.title.lastIndexOf('@')
      //   );
      //   const emailDomain = partner.title.substring(
      //     partner.title.lastIndexOf('@') + 1
      //   );
      //   const last2 = emailname.slice(-2);
      //   partner.displayTitle =
      //     emailname.substring(0, totalCharAllowed - emailDomain.length) +
      //     '...' +
      //     emailname.slice(-2) +
      //     '@' +
      //     emailDomain;
      // }
      const partnerAcceptancePending =
        partner.invitationStatus === ShareStatus.PENDING;
      const isPartner = partner.invitationStatus === ShareStatus.ACCEPTED;
      if (partnerAcceptancePending) {
        partner.subtitle = 'DATA_ACCESS.INVITATION_SENT';
      } else if (isPartner) {
        partner.subtitle = partner.email;
      } else {
        const statusCode =
          partner.invitationStatus !== ShareStatus.UNKNOWN
            ? partner.invitationStatus.toUpperCase()
            : 'UNKNOWN';
        partner.subtitle = statusCode;
      }
    });
    this.partnerDetails = Array.from(partners.values());
    this._dataAccessClientsService.add(Array.from(partners.values()));
    this.sortAndFilterpartnerDetails = Array.from(partners.values());
    this.sortListofPartner(false);
  }

  chooseMenuItem(choose: string) {
    switch (choose) {
      case 'REMOVE':
        this.removePartner(this.seletedItem);
        break;
      default:
      this._dataAccessClientsService
          .putResendInvite(this.seletedItem.id)
          .subscribe(res => {
            if (res['success']) {
              this._snackBarService.open(
                this.translate.instant('DATA_ACCESS.INVITATION_SENT')
              );
            } else if (res['status'] === 400) {
              this._snackBarService.open(
                this.translate.instant('DATA_ACCESS.SHARE_ALREADY_ACCEPT')
              );
            } else {
              this._snackBarService.open(res['message']);
            }
          });
        console.warn('Invalid partner event');
        break;
    }
  }

  removePartner(partner) {
    if (!(partner && partner.email && partner.id)) {
      return;
    }
    let contentText;
    this.translate
      .get('DATA_ACCESS.REMOVE_PARTNER_MODAL.CONTENT', {
        partner: partner.email
      })
      .subscribe((res: string) => {
        contentText = res;
      });
    const modalData: IModalData = {
      cancelLabel: this.translate.instant('GLOBAL.CANCEL'),
      confirmColor: CnhThemeColor.PRIMARY,
      confirmLabel: this.translate.instant('GLOBAL.CONFIRM'),
      contentText: contentText,
      iconName: 'warning-2',
      header: this.translate.instant('DATA_ACCESS.REMOVE_PARTNER_MODAL.TITLE'),
      name: 'cnhDataAccess_confirmPartnerRemoval'
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
            this._dataAccessClientsService.deleteShare(partner.rawId).subscribe(
              () => {
                this._router.navigate(['data/data-access/my-data/']);
                this.callPartnerDate();
                this._snackBarService.open(
                  this.translate.instant('DATA_ACCESS.REMOVE_PARTNER_SUCCESS')
                );
              },
              err => {}
            );
          }
        },
        err => console.log(err)
      );
  }
  sortListofPartner(sortValueChange: boolean = true) {
    if (sortValueChange) {
      this.sortPosition = !this.sortPosition;
    }

    if (this.sortPosition) {
      this.sortAndFilterpartnerDetails = _.sortBy(
        this.sortAndFilterpartnerDetails,
        function(i) {
          if (_.isString(i['title'])) {
            return i['title'].toLowerCase();
          } else {
            return i['title'];
          }
        }
      );
      this.sortingOrder = this.translate.instant('GLOBAL.ASCENDENT');
    } else {
      this.sortAndFilterpartnerDetails = _.sortBy(
        this.sortAndFilterpartnerDetails,
        function(i) {
          if (_.isString(i['title'])) {
            return i['title'].toLowerCase();
          } else {
            return i['title'];
          }
        }
      ).reverse();
      this.sortingOrder = this.translate.instant('GLOBAL.DESCENDENT');
    }
  }
  onSearchValueChange(searchString: string) {
    if (_.isEmpty(searchString)) {
      this.sortAndFilterpartnerDetails = this.partnerDetails;
    } else {
      this.sortAndFilterpartnerDetails = _.filter(
        this.sortAndFilterpartnerDetails,
        function(num) {
          return (
            num.title.toLowerCase().indexOf(searchString.toLowerCase()) > -1 ||
            num.email.toLowerCase().indexOf(searchString.toLowerCase()) > -1
          );
        }
      );
    }
    this.sortListofPartner(false);
  }

  onTabClicked(index: number) {
    if (index === 0) {
      this._router.navigate([
        '/data/data-access/my-data/' +
          (this.seletedItem.id ? this.seletedItem.id : '')
      ]);
      this.tabs[0].active = true;
      this.tabs[1].active = false;
    } else if (!this.tabs[index].disabled) {
      this._router.navigate([
        '/data/data-access/partner-data/' +
          (this.seletedItem.id ? this.seletedItem.id : '')
      ]);
      this.tabs[1].active = true;
      this.tabs[0].active = false;
    }
  }
  focusInput() {
    document.getElementById('searchInput').focus();
  }
  disablePartnerMenu(share) {
    this.tabs[1].disabled =
      !share ||
      (share &&
        !share.shareAll &&
        !share.shareFieldObjects &&
        (!share.sharedItems ||
          (Array.isArray(share.sharedItems) && !share.sharedItems.length)) &&
        (!share.operations ||
          (Array.isArray(share.operations) && !share.operations.length)));
    if (this.tabs[1].disabled && this.tabs[1].active) {
      this.onTabClicked(0);
    }
  }
  onClick(index: number) {
    this.seletedItem = this.sortAndFilterpartnerDetails[index];
    this._dataAccessClientsService
      .getReceivedByInviteId(
        this.seletedItem.id,
        this._dataAccessClientsService.getUserCompanyId()
      )
      .subscribe(share => {
        this.disablePartnerMenu(share);
      });
    if (this.tabs[0].active) {
      this._router.navigate([
        '/data/data-access/my-data/' + this.seletedItem.id
      ]);
    } else {
      this._router.navigate([
        '/data/data-access/partner-data/' + this.seletedItem.id
      ]);
    }
  }
  public addPartner(): void {
    this._dialog
      .open(CnhModalInviteComponent, {
        width: '600px',
        disableClose: true,
        data: {
          title: this.translate.instant('INVITE.INVITE_PARTNER'),
          confirmButton: this.translate.instant('GLOBAL.SEND'),
          cancelLabel: this.translate.instant('GLOBAL.CANCEL'),
          email: this.userData
        }
      })
      .afterClosed()
      .subscribe(({ response, payload }) => {
        if (payload && payload.inviteSent) {
          this._dataAccessClientsService.getDataAccess().subscribe(partners => {
            if (payload.shareId && payload.inviteId) {
              const newPartner = this.partnerDetails.find(
                partner => partner && partner.id === payload.inviteId
              );
              if (newPartner) {
                if (this._router.url === '/data/data-access/my-data') {
                  this._router.navigate(
                    ['/data/data-access/my-data/' + payload.inviteId],
                    {
                      replaceUrl: true
                    }
                  );
                } else {
                  this._router
                    .navigate([
                      '/data/data-access/my-data/',
                      {
                        replaceUrl: true
                      }
                    ])
                    .then(() => {
                      this._router.navigate(
                        ['/data/data-access/my-data/' + payload.inviteId],
                        {
                          replaceUrl: true
                        }
                      );
                    });
                }
                if (response) {
                  this._trowserService.createTrowser({
                    title: this.translate.instant('DATA_ACCESS.SETUP'),
                    contentComponent: CnhTrowserDataSharingComponent,
                    data: {
                      partner: newPartner,
                      shareId: payload.shareId
                    }
                  });
                }
              }
            }
          });
        }
      });
  }
}
