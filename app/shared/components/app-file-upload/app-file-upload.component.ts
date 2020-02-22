import { Component, OnInit, Input } from '@angular/core';
import { FileUploadService } from '@services/file-upload/file-upload.service';
import { FarmUploadApi } from '@models/farm-file-upload';
import { UploadDialogComponent } from '@shared-components/app-file-upload/upload-dialog/upload-dialog.component';
import { MatDialog } from '@angular/material';
import * as _ from 'underscore';
import { UserService } from '@services/user/user.service';
import { TranslateService } from '@ngx-translate/core';
import { BrandNames, BrandColors } from '@enums/brand.enum';
import * as moment from 'moment';
import { Moment } from 'moment';
import { UtilService } from '@services/util/util.service';

import { AppSettingsService } from '@services/app-settings/app-settings.service';
@Component({
  selector: 'app-file-upload',
  templateUrl: './app-file-upload.component.html',
  styleUrls: ['./app-file-upload.component.css']
})
export class AppFileUploadComponent implements OnInit {
  @Input('activeRoute')
  activeRoute: string;
  constructor(
    private fileUploadService: FileUploadService,
    private dialog: MatDialog,
    private userService: UserService,
    private readonly translate: TranslateService,
    private _utilService: UtilService,
    public appSettingsService: AppSettingsService
  ) {
    this.translate.setDefaultLang('en');
  }
  public fileUploadLists: FarmUploadApi[] = [];
  // public fileUploadGroup = {};
  public fileUploadGroupKey = [];
  public fileUploadSuccessApiList: any = [];
  public uploadCalls: number = 0;
  brand: string;
  brands = BrandNames;
  selectedTab: number = 0;
  userTimeFormat: string;
  tzOffset: string;
  ngOnInit() {
    this.brand = this.userService.getBrand();
    this.translate.use(this.userService.getUserPreferredLang());

    this.getnotificationFromApi(true);

    this.fileUploadService.updateFileUpload$.subscribe(data => {
      if (data) {
        this.fileUploadLists.unshift(data);
      }
    });
    this.fileUploadService.resetTab$.subscribe(data => {
      if (data) {
        this.selectedTab = 0;
        this.sortNotificationArray();
      }
    });
    this.fileUploadService.updateFiletrackingId$.subscribe(data => {
      if (data) {
        const findIndexValue = _.findIndex(this.fileUploadLists, {
          RandomId: data.RandomId
        });
        if (findIndexValue > -1) {
          this.fileUploadLists[findIndexValue] = data;
          this.fileUploadLists[findIndexValue].StatusCode = 5;
          this.fileUploadLists[findIndexValue].PercentComplete = 100;
          this.fileUploadLists[findIndexValue].Type = 'FileTransfer';
        }
        this.getnotificationFromApi(false);
      }
    });
  }
  redirectToConflicts() {
    window.location.href = this.appSettingsService.appSettings.farmRedirect + '/data/conflicts';
  }
  tabchange(index) {
    this.selectedTab = index;
    this.sortNotificationArray();
  }
  sortNotificationArray() {
    // let fileUploadLists = [];
    if (this.selectedTab) {
      this.fileUploadGroupKey = [];
    } else {
      // this.fileUploadGroupKey = this.fileUploadLists.filter(f => f.Type !== 'FileTransfer');
      this.fileUploadGroupKey = this.fileUploadLists;
    }

    this.fileUploadGroupKey.forEach(value => {
      if (value.Type === 'FileTransfer') {
        value.PercentComplete = 100;
        if (value.TransferStatus) {
          value.TransferStatus = value.TransferStatus.toUpperCase();
        }
      }
    });

    // fileUploadLists.sort(
    //   (a, b) =>
    //     sortingOrder.indexOf(a.StatusCode) - sortingOrder.indexOf(b.StatusCode)
    // );
    // this.fileUploadGroupKey = [];
    // fileUploadLists.forEach((file, index) => {
    //   if (file.StatusCode === 7) {
    //     this.pushIntoFileArray('CONFLICT', file);
    //   } else if (file.StatusCode === 6) {
    //     this.pushIntoFileArray('INPROGRESS', file);
    //   }
    //   if (file.StatusCode === 5) {
    //     this.pushIntoFileArray('SUCCESS', file);
    //   }
    // });
    // console.log(this.fileUploadGroup, this.fileUploadGroupKey);
    // console.log(this.fileUploadLists);
  }

  // pushIntoFileArray(key, file) {
  //   if (!this.fileUploadGroupKey.includes(key)) {
  //     this.fileUploadGroupKey.push(key);
  //     this.fileUploadGroup[key] = [];
  //   }
  //   this.fileUploadGroup[key].push(file);
  // }
  getnotificationFromApi(setTimeoutValue) {
    this.fileUploadService.getNotification().subscribe(data => {
      if (setTimeoutValue) {
        setTimeout(() => {
          this.getnotificationFromApi(true);
        }, 30000);
      }
      if (this.fileUploadLists.length === 0) {
        this.fileUploadLists = data['Values'] ? data['Values'] : [];
      } else {
        data['Values'].forEach(element => {
          let findIndexValue;
          if (element.Type === 'FileUpload') {
            findIndexValue = _.findIndex(this.fileUploadLists, {
              TrackingCode: element.TrackingCode
            });
          } else {
            findIndexValue = _.findIndex(this.fileUploadLists, {
              ID: element.ID
            });
          }
          if (findIndexValue > -1) {
            this.fileUploadLists[findIndexValue] = element;
          } else {
            this.fileUploadLists.unshift(element);
          }
        });
      }
      this.tzOffset = this._utilService.getTimezoneOffset();
      let timeZone = this._utilService.getTimezoneOffset();
      let userTimeFormat = this.userService.getTimeFormat();
      userTimeFormat = userTimeFormat.replace('YYYY', 'yyyy');
      userTimeFormat = userTimeFormat.replace('DD', 'dd');
      this.userTimeFormat = userTimeFormat;
      this.fileUploadLists.forEach(element => {
        // element.CreatedTime = '2019-06-23T19:23:01.423Z';
        if (!timeZone) {
          timeZone = '0000';
        }
        const CreatedTime = moment.utc(element['CreatedTime']).utcOffset(timeZone);

        let m: Moment | null = null;
        m = moment.utc(CreatedTime.valueOf()).utcOffset(timeZone);
        element['timeFormat'] = m.utc().toDate();
        const referenceData = CreatedTime.clone().calendar(moment.utc().utcOffset(timeZone), {
          sameDay: '[TODAY]',
          lastDay: '[OLDER]',
          lastWeek: '[OLDER]',
          sameElse: (now: Moment) => {
            return '[OLDER]';
          }
        });
        element['timeFormatReference'] = referenceData;
      });
      if (
        this.fileUploadSuccessApiList.length !==
        _.where(this.fileUploadLists, { Type: 'FileUpload', StatusCode: 5 }).length
      ) {
        if (this.uploadCalls > 0) {
          this.fileUploadService.gotSuccessFromAPI();
        }
        this.uploadCalls++;
      }
      this.fileUploadSuccessApiList = _.where(this.fileUploadLists, {
        Type: 'FileUpload',
        StatusCode: 5
      });
      this.sortNotificationArray();
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(UploadDialogComponent, {
      width: '684px'
    });

    dialogRef.afterClosed().subscribe(result => {});
  }
}
