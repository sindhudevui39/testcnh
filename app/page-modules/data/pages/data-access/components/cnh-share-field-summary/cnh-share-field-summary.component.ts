import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { MomentLocaleService } from '../../../inbox/services/moment-locale.service';
import { forkJoin } from 'rxjs';
import { DataAccessClientsService } from '../../services/data-access.services';
import { CnhTrowserService } from '../../services/data-access-setup-service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'cnh-share-field-summary',
  templateUrl: './cnh-share-field-summary.component.html',
  styleUrls: ['./cnh-share-field-summary.component.css']
})
export class CnhShareFieldSummaryComponent implements OnInit, OnChanges {
  @Input()
  public share: any;
  @Input()
  public isPartner: boolean;

  public isLoading = false;
  public operationalData: string[] = [];
  public setupData: string;
  public fields: string;
  public timeframe: string;
  public fieldExpand: any[] = [];
  public fieldsforExpand: any[] = [];
  public formatforArea = '';
  public expandField = false;
  public constructor(
    private momentLocale: MomentLocaleService,
    private _dataAccessClientsService: DataAccessClientsService,
    private _cnhTrowserService: CnhTrowserService,
    private readonly translate: TranslateService
  ) {
    // Empty
  }

  public ngOnInit(): void {
    this.formatforArea = '';
    this.expandField = false;
  }
  public ngOnChanges(changes: SimpleChanges): void {
    this.update();
    this.isLoading = false;
    this.fieldExpand = [];
    this.expandField = false;
  }
  public openFieldSection(share) {
    let shardValuelength = this.fieldsforExpand;
    if (!this.expandField && !this.isLoading) {
      this.isLoading = true;
      const filterId = [];
      for (let i = 0; i < shardValuelength.length; i++) {
        filterId.push(
          this._dataAccessClientsService.getfieldData(shardValuelength[i])
        );
      }
      forkJoin(this._cnhTrowserService.getDataFields()).subscribe(res => {
        this.fieldExpand = [];
        if (this.expandField && this.share.id === share.id) {
          const responseArray = res[0]['Values'];
          const farmIds = [];
          const growerIds = [];
          this.isLoading = false;
          for (let i = 0; i < responseArray.length; i++) {
            if (responseArray[i].Area) {
              this.formatforArea = responseArray[i].Area.Uom;
              break;
            }
          }
          shardValuelength = shardValuelength.map(i => i.id);
          responseArray.map(i => {
            if (shardValuelength.indexOf(i['ID']) > -1) {
              if (
                i.FarmID &&
                farmIds.indexOf(i.FarmID) > -1 &&
                growerIds[farmIds.indexOf(i.FarmID)] === i.GrowerID
              ) {
                if (this.expandField) {
                  this.fieldExpand[farmIds.indexOf(i.FarmID)].push(i);
                }
              } else {
                if (this.expandField) {
                  this.fieldExpand.push([i]);
                  farmIds.push(i.FarmID);
                  growerIds.push(i.GrowerID);
                }
              }
            }
          });
        }
      });
    }
    this.expandField = !this.expandField;
    if (!this.expandField && this.isLoading) {
      this.isLoading = false;
    }
  }
  private update() {
    if (this.share) {
      // operational data
      this.operationalData = [];
      if (
        this.share.operations &&
        this.share.operations instanceof Array &&
        this.share.operations.length
      ) {
        this.operationalData = this.share.operations.map(
          operation =>
            operation &&
            typeof operation === 'string' &&
            operation.toUpperCase()
        );
      }

      // timeframe
      this.timeframe =
        (this.share.dateFrom
          ? this.momentLocale.formatDate(this.share.dateFrom, 'YYYY')
          : 'NO DATA') + ' - to Ongoing';

      if (this.share.shareFieldObjects) {
        this.setupData = this.translate.instant('DATA_ACCESS.SETUP_DATA_ALL');
      } else {
        this.setupData = this.translate.instant(
          'DATA_ACCESS.SHARE_CARD.NO_SETUP_DATA'
        );
      }
      if (this.share.shareAll) {
        this.fields = this.translate.instant(
          'DATA_ACCESS.SHARE_CARD.FIELDS.ALL'
        );
      } else {
        let fields: string | number = -1;
        if (this.share.sharedItems && this.share.sharedItems instanceof Array) {
          this.fieldsforExpand = this.share.sharedItems.filter(
            item => item.shareType === 'Field'
          );
          fields = this.share.sharedItems.filter(
            item => item.shareType === 'Field'
          ).length;
          if (fields === 1) {
            this.fields = this.translate.instant(
              'DATA_ACCESS.SHARE_CARD.FIELDS.1'
            );
          } else if (fields === 0) {
            this.fields = this.translate.instant(
              'DATA_ACCESS.SHARE_CARD.FIELDS.0'
            );
          } else {
            this.translate
              .get('DATA_ACCESS.SHARE_CARD.FIELDS.N', { fields: fields })
              .subscribe((res: string) => {
                this.fields = res;
              });
          }
        } else {
        }
      }
    }
  }
}
