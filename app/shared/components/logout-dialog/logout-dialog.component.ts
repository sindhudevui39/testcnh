import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material';

import { AuthService } from '@services/auth/auth.service';
import { UserService } from '@services/user/user.service';
import { BrandNames } from '@enums/brand.enum';

import { RemoteDisplayService } from '@remote-display/services/remote-display/remote-display.service';
import { TranslatedRDVLabels } from '@remote-display/rdv.enums';

@Component({
  selector: 'app-logout-dialog',
  templateUrl: './logout-dialog.component.html',
  styleUrls: ['./logout-dialog.component.css']
})
export class LogoutDialogComponent implements OnInit {
  public brands = BrandNames;
  private _isRdvEnabled = false;
  private _logoutRequired = false;

  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<LogoutDialogComponent>,
    private authService: AuthService,
    public userService: UserService,
    private _remoteDisplay: RemoteDisplayService
  ) {}

  ngOnInit() {
    this._remoteDisplay.enableRemoteDisplayView$.subscribe(data => {
      if (this._logoutRequired) {
        this.logout();
      }

      this._isRdvEnabled = data.enable;
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm() {
    if (this._isRdvEnabled) {
      this._logoutRequired = true;

      this._remoteDisplay.abortDeviceNotification('PAGE_RDV.TERMINATION_CLIENT');
    } else {
      this.logout();
    }
  }

  private logout() {
    this.http.post('api/account/logout', {}).subscribe(resp => {
      if (resp['logout'] === 'success') {
        this.authService.logout();
      }
    });
  }
}
