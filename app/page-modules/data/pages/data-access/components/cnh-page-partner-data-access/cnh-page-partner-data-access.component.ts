import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, of, Subscription, Subject } from 'rxjs';
import * as moment from 'moment';
import { Moment } from 'moment';
import { map, shareReplay, skip, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { DataAccessClientsService } from '../../services/data-access.services';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '@services/user/user.service';
import { UtilService } from '@services/util/util.service';
@Component({
  selector: 'cnh-page-partner-data-access',
  templateUrl: './cnh-page-partner-data-access.component.html',
  styleUrls: ['./cnh-page-partner-data-access.component.css']
})
export class CnhPagePartnerDataAccessComponent implements OnInit, OnDestroy {
  protected subscriptions: Set<Subscription> = new Set();
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  public partnersLoading$: Observable<boolean>;
  public activePartner: any;
  public partnerId$: Observable<string | number>;
  public isPartner: boolean;
  public activeShare$: Observable<any>;

  public dropdownMenuItems: any[];

  public activeFieldDataCreatedAt: string;
  public isDataShareDisabled = false;

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public constructor(
    private route: ActivatedRoute,
    private _dataAccessClientsService: DataAccessClientsService,
    private router: Router,
    private readonly translate: TranslateService,
    private userService: UserService,
    private _utilService: UtilService
  ) {}

  public ngOnInit(): void {
    this.partnerId$ = this.route.paramMap.pipe(
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
          return this._dataAccessClientsService.getReceivedByInviteId(
            partner.id,
            this._dataAccessClientsService.getUserCompanyId()
          );
        } else {
          return of(null);
        }
      })
    );

    this.activeShare$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(share => {
      this.checkIsDataShareDisabled(share);
      if (share && share.createdAt) {
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

  private checkIsDataShareDisabled(share) {
    this.isDataShareDisabled =
      !share ||
      (share &&
        !share.shareAll &&
        !share.shareFieldObjects &&
        (!share.sharedItems || (Array.isArray(share.sharedItems) && !share.sharedItems.length)) &&
        (!share.operations || (Array.isArray(share.operations) && !share.operations.length)));
  }
}
