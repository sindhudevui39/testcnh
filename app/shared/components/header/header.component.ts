import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

import { AppSettingsService } from '@services/app-settings/app-settings.service';
import { FleetHistroyNotificationService } from '@services/fleet-histroy-notification/fleet-histroy-notification.service';
import { UserService } from '@services/user/user.service';

import { LogoutDialogComponent } from '@shared-components/logout-dialog/logout-dialog.component';

import { BrandNames } from '@enums/brand.enum';
import { User } from '@models/user';
import { FileUploadService } from '@services/file-upload/file-upload.service';
import { MatDialogRef } from '@angular/material';

const enum ETIM_ICE_CODE {
  CASE_IH = 'A',
  NEW_HOLLAND = 'B',
  STEYR = 'C'
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input('activeRoute')
  activeRoute: string;

  user: User;
  userInitials: string;
  applicationList: any[] = [];
  brand: string;
  brands = BrandNames;
  opennotificationHistory = false;

  drawerOpen = false;
  openUserDropdown = false;
  openApplicationDropdown = false;
  openfileuploadDropdown = false;
  unReadNotify = 0;
  openDialogs: MatDialogRef<any>[];

  constructor(
    private dialog: MatDialog,
    public userService: UserService,
    private router: Router,
    private translate: TranslateService,
    private _fleetHistroyNotificationService: FleetHistroyNotificationService,
    private _appSettings: AppSettingsService,
    private _fileUploadService: FileUploadService
  ) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit() {
    this._fleetHistroyNotificationService.notificationUnread$.subscribe((num: number) => {
      this.unReadNotify = num;
    });

    // this._fileUploadService.openheaderNotification$.subscribe((state: boolean) => {
    //   if (state) {
    //     this.togglefileuploadDropdown();
    //   }
    // });

    this.translate.use(this.userService.getUserPreferredLang());

    this.user = this.userService.getUser();
    this.brand = this.userService.getBrand();

    if (this.user.firstName && this.user.lastName) {
      this.userInitials = this.user.firstName.charAt(0) + this.user.lastName.charAt(0);
    }

    this.setupDashboardIconLinks();
  }

  notDataModule() {
    return this.activeRoute === 'data';
  }
  showIconInFleetAndData() {
    return (
      this.activeRoute === 'data' ||
      (this.activeRoute === 'fleet' && !this.userService.isDealer$.value)
    );
  }
  showFileTransfer() {
    return this._appSettings.appSettings.canFileUpload !== 'false';
  }

  notfleetModule() {
    return this.activeRoute === 'fleet' || this.activeRoute === 'data';
  }

  redirectToApp(link: string): void {
    window.open(link, '_blank');
  }

  openNav() {
    this.drawerOpen = !this.drawerOpen;
  }

  closeNav() {
    this.drawerOpen = false;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LogoutDialogComponent, {
      width: '442px'
    });

    dialogRef.afterClosed().subscribe(result => {});
  }
  closefileuploadDropdown() {
    if (this.dialog.openDialogs.length === 0) {
      this.openfileuploadDropdown = false;
    }
  }

  togglefileuploadDropdown() {
    this.openfileuploadDropdown = !this.openfileuploadDropdown;
    if (this.openfileuploadDropdown) {
      this._fileUploadService.resetTab.next(true);
    }
  }
  closeApplicationDropdown() {
    this.openApplicationDropdown = false;
  }

  closeUserDropdown() {
    this.openUserDropdown = false;
  }

  closenotificationHistroy() {
    this.opennotificationHistory = false;
    if (this.unReadNotify > 0) {
      this._fleetHistroyNotificationService.getNotificationDate();
    }
  }

  toggleApplicationDropdown() {
    this.openApplicationDropdown = !this.openApplicationDropdown;
  }

  toggleUserDropdown() {
    this.openUserDropdown = !this.openUserDropdown;
  }

  togglenotificationHistroy() {
    this.opennotificationHistory = !this.opennotificationHistory;
    if (!this.opennotificationHistory && this.unReadNotify > 0) {
      this._fleetHistroyNotificationService.getNotificationDate();
    }
  }

  public setupDashboardIconLinks(): void {
    this.applicationList = [];

    let brandName = '';
    let url = '';

    const { isDealer, brand } = this.userService.getUser();

    switch (this.userService.getBrand()) {
      case this.brands.NH:
        brandName = 'MY NEW HOLLAND';
        url = this._appSettings.appSettings.myNhBrandUrl;
        break;
      case this.brands.CIH:
        brandName = 'MY CASE IH';
        url = this._appSettings.appSettings.myCaseBrandUrl;
        break;
    }

    if (!isDealer) {
      this.applicationList = [
        {
          label: brandName,
          url
        }
      ];
    }
    // else {
    //   let brandCode = '';

    //   if (brand === 'NHAG') {
    //     brandCode = ETIM_ICE_CODE.NEW_HOLLAND;
    //   } else if (brand === 'CSAG') {
    //     brandCode = ETIM_ICE_CODE.CASE_IH;
    //   } else {
    //     brandCode = ETIM_ICE_CODE.STEYR;
    //   }

    //   this.applicationList = [
    //     {
    //       label: 'eTIM Dashboard',
    //       url: `${
    //         this._appSettings.appSettings.etimDashboard
    //       }&extraSsoName=brand_code&extraSsoValue=${brandCode}`
    //     }
    //   ];
    // }
  }
}
