import { Component, OnInit, Inject, InjectionToken, FactoryProvider } from '@angular/core';
import { String, StringBuilder } from 'typescript-string-operations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataClientsService } from './services/data.service';
import { CnhModalComponent } from './components/cnh-modal/cnh-modal.component';
import { UserService } from '@services/user/user.service';
import { forkJoin } from 'rxjs';
import 'simplebar';
import { CnhSnackBarService } from '../data-access/services/cnh-snack-bar.service';
import * as _ from 'underscore';
import { environment } from '../../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AppSettingsService } from '@services/app-settings/app-settings.service';
import { Urls } from '../../../../shared/enums/urls.enum';
export interface DialogData {
  Title: string;
}

@Component({
  selector: 'app-data-access',
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.css']
})
export class Connections implements OnInit {
  public clients: Array<any> = [];
  public integratedClients: Array<any> = [];
  connectionSpecificReg: any;
  userCompanyList: any = [];
  userId: string;
  companyID: string;
  grants: any = [];
  FMISCompanies: any = [];
  isLoading = false;
  isconnectedlocal = false;
  grantId: Array<string> = [];
  brand: string;
  testval: string;
  isConnectedClimate: boolean;
  constructor(
    private location: Location,
    public dialog: MatDialog,
    private dataClientsService: DataClientsService,
    public userService: UserService,
    private _snackBarService: CnhSnackBarService,
    private router: Router,
    private readonly translate: TranslateService,
    @Inject('window') private window: Window
  ) {
    this.dataClientsService.getregionList().subscribe(res => {
      this.connectionSpecificReg = res;
    });
    this.translate.setDefaultLang('en');
    this.userId = userService.user.email;
  }

  ngOnInit() {
    this.translate.use(this.userService.getUserPreferredLang());
    this.brand = this.userService['_user'].brand;
    localStorage.setItem('currentRoute', this.router.url);
    let url = window.location.href;
    this.isLoading = false;
    this.isConnectedClimate = false;
    this.getallApis();
    this.integratedClients = new Array();
    this.integratedClients.push({
      client_id: 1234,
      logo_uri: './assets/images/climate-fieldview@3x.png',
      name: 'Climate FieldView',
      description:
        'Users of Climate FieldView™ Drive can connect their FieldView Drive enabled vehicles to AFS Connect portal, allowing them to track the current location of the vehicles, view their status and parameters within AFS Connect.',
      isConnected: this.isconnectedlocal,
      client_metadata: {
        landing_page:
          `${Urls.CLIMATEEXTURL}` +
          this.window.location.origin +
          '/login-redirect&client_id=partner-cnh'
      }
    });

    if (this.userService.hasClimateAccess) {
      this.dataClientsService.getUserData().subscribe(t => {
        this.companyID = t.companyId;
        this.dataClientsService.getStatusOfUser(this.companyID).subscribe(userStatus => {
          if (userStatus.user_connection_status === 'CONNECTED') {
            this.isconnectedlocal = true;
            this.integratedClients[0].isConnected = true;
          } else {
            let tokenddata = localStorage.getItem('resp');
            if (tokenddata != null && tokenddata !== '' && tokenddata !== undefined) {
              let body = JSON.parse(tokenddata);
              body['secondaryPartyId'] = 1;
              body['userId'] = t.id;
              body['companyID'] = t.companyId;
              body['secondaryPartyUserID'] = 1;
              this.dataClientsService.saveClimateToken(body).subscribe(saveStatus => {
                if (saveStatus['code'] === 200) {
                  this.dataClientsService.enableClimate().subscribe(enstatus => {
                    this.openConnectedModal(this.integratedClients[0]);
                  });
                }
              });
            }
          }
        });
      });
    }
  }

  public GetParameterValues() {
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  }

  public getallApis() {
    this.isLoading = true;
    forkJoin([
      this.dataClientsService.getClients(),
      this.dataClientsService.getClientsConnectInfo(this.userId),
      this.userService.getUserFMISFilters()
    ]).subscribe(res => {
      if (res[2]) {
        if (!res[2].error) {
          this.FMISCompanies = res[2].map(item => item.fmisCompany.toLowerCase());
        }
      }
      this.isLoading = false;
      if (res && res.length) {
        if (res[1]) {
          this.grants = res[1].map(item => item.clientID);
          this.grantId = res[1].map(item => item.id);
        }
        // if (this.grants.length) {
        this.clients = res[0].map(item => {
          item.isConnected = this.grants.indexOf(item.client_id) > -1 ? true : false;
          if (this.grants.indexOf(item.client_id) > -1) {
            item.grantId = this.grantId[this.grants.indexOf(item.client_id)];
          }
          return item;
        });
        const userData = this.userService.getUser();
        let userCountryRegion;
        _.each(this.connectionSpecificReg, function(region: Array<string>, index) {
          if (_.indexOf(region, userData.countryCode) > -1) {
            userCountryRegion = index;
          }
        });
        let filteredValue = this.clients.filter((client: any) => {
          return client.client_metadata && client.client_metadata.is_visible === 'true';
        });
        if (!this.userService.storedUserPreferences.filterFmis && userCountryRegion) {
          filteredValue = filteredValue.filter((client: any) => {
            return client.client_metadata.region.indexOf(userCountryRegion) > -1;
          });
        }
        let filteredFMISValues = this.clients.filter((client: any) => {
          return (
            client.client_metadata && client.client_metadata.company &&
            this.FMISCompanies.includes(client.client_metadata.company.toLowerCase())
          );
        });
        filteredValue = filteredValue.concat(filteredFMISValues);
        filteredValue = filteredValue.sort((a, b) => Number(b.isConnected) - Number(a.isConnected));
        this.clients = filteredValue;
      }
    });
  }

  public openConnectModal(appIntegration) {
    let modelTitle;
    this.translate
      .get('INTEGRATION.CONNECT_TO', { appName: appIntegration.name })
      .subscribe((res: string) => {
        modelTitle = res;
      });
    let connectDisclaim;
    this.translate
      .get('INTEGRATION.CONNECT_DISCLAIM', { appName: appIntegration.name })
      .subscribe((res: string) => {
        connectDisclaim = res;
      });
    const modalData: any = {
      app: appIntegration,
      title: modelTitle,
      confirmLabel: this.translate.instant('INTEGRATION.CONNECT'),
      cancelLabel: this.translate.instant('GLOBAL.CANCEL'),
      disableClose: true,
      header: this.translate.instant('INTEGRATION.CONNECT_TITLE'),
      isConnect: true,
      contentText: connectDisclaim
    };

    this.dialog
      .open(CnhModalComponent, {
        width: '684px',
        disableClose: true,
        data: modalData,
        autoFocus: false
      })
      .afterClosed()
      .subscribe(data => {
        if (data && data.response) {
          // window.open(
          //   appIntegration.client_metadata.landing_page,
          //   '_blank' // <- This is what makes it open in a new window.
          // );
        }
      });
  }
  public openDisconnectModal(app) {
    let contentText;
    const name = app.name || '[Application Name]';
    this.translate
      .get('INTEGRATION.DISCONNECT_MODAL.CONTENT', { name: name })
      .subscribe((res: string) => {
        contentText = res;
      });
    let headerText;
    this.translate
      .get('INTEGRATION.DISCONNECT_MODAL.TITLE', { name: name })
      .subscribe((res: string) => {
        headerText = res;
      });
    // TODO: choose a better default app name
    const modalData: any = {
      cancelLabel: this.translate.instant('GLOBAL.CANCEL'),
      confirmLabel: this.translate.instant('INTEGRATION.DISCONNECT'),
      contentText: contentText,
      disableClose: true,
      // iconName: 'warning',
      header: headerText,
      isConnect: false,
      name: 'connectFmis_confirm'
    };
    this.dialog
      .open(CnhModalComponent, {
        width: '448px',
        disableClose: true,
        data: modalData,
        autoFocus: false
      })
      .afterClosed()
      .toPromise()
      .then(data => {
        if (data && data.response) {
          this.dataClientsService.disconnectApp(app.grantId, this.userId).subscribe(
            () => {
              // refresh the list
              this.translate
                .get('INTEGRATION.DISCONNECTION_SUCCESS', {
                  name: app.name
                })
                .subscribe((res: string) => {
                  this._snackBarService.open(res);
                });
              this.getallApis();
              return true;
            },
            error => {
              console.error('Error saving !');
            }
          );
        }
      })
      .catch(() => {});
  }
  public openConnectedModal(acc) {
    let modelTitle;
    let app = {
      name: 'Climate FieldView',
      logo_uri: './assets/images/dialog.svg'
    };
    this.translate
      .get('CLIMATEMODAL.CONNECT_TO', { appName: app.name })
      .subscribe((res: string) => {
        modelTitle = res;
      });
    const modalData: any = {
      app: app,
      title: modelTitle,
      confirmLabel: this.translate.instant('CLIMATEMODAL.CONNECT'),
      cancelLabel: '',
      disableClose: true,
      header: this.translate.instant('CLIMATEMODAL.CONNECT_TITLE'),
      isConnect: true,
      hasCancel: false,
      contentText: this.translate.instant('CLIMATEMODAL.CONNECT_DISCLAIM')
    };

    this.dialog
      .open(CnhModalComponent, {
        width: '684px',
        disableClose: true,
        data: modalData,
        autoFocus: false
      })
      .afterClosed()
      .subscribe(data => {
        if (data && data.response) {
          this.isconnectedlocal = true;
          this.integratedClients[0].isConnected = this.isconnectedlocal;
          localStorage.removeItem('resp');
          // window.open(
          //   appIntegration.client_metadata.landing_page,
          //   '_blank' // <- This is what makes it open in a new window.
          // );
        }
      });
  }
  public openDisconnectedModal(app) {
    let contentText;
    const name = app.name || '[Application Name]';
    this.translate
      .get('CLIMATEMODAL.CLIMATEDISCONNECT_MODAL.CONTENT', { name: name })
      .subscribe((res: string) => {
        contentText = res;
      });
    let headerText;
    this.translate
      .get('CLIMATEMODAL.CLIMATEDISCONNECT_MODAL.TITLE', { name: name })
      .subscribe((res: string) => {
        headerText = res;
      });
    const modalData: any = {
      cancelLabel: this.translate.instant('GLOBAL.CANCEL'),
      confirmLabel: this.translate.instant('CLIMATEMODAL.DISCONNECT'),
      contentText: contentText,
      disableClose: true,
      // iconName: 'warning',
      header: headerText,
      isConnect: false,
      name: 'connectFmis_confirm'
    };
    this.dialog
      .open(CnhModalComponent, {
        width: '448px',
        disableClose: true,
        data: modalData,
        autoFocus: false
      })
      .afterClosed()
      .toPromise()
      .then(data => {
        if (data && data.response) {
          this.dataClientsService.disconnectClimateApp(this.companyID).subscribe(
            data => {
              this.isconnectedlocal = false;
              this.integratedClients[0].isConnected = data['code'] == 200 ? false : true;
              if (data['code'] == 200) {
                this.dataClientsService.disableClimate().subscribe(t => {
                  this.integratedClients[0].isConnected = false;
                });
              }
              this.translate
                .get('CLIMATEMODAL.DISCONNECTION_SUCCESS', {
                  name: app.name
                })
                .subscribe((res: string) => {
                  this._snackBarService.open(res);
                });
              return true;
            },
            error => {
              console.error('Error saving !');
            }
          );
        }
      })
      .catch(() => {});
  }
}
