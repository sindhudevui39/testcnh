import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { AppSettingsService } from '@services/app-settings/app-settings.service';

import { BrandColors } from '@enums/brand.enum';
import { UserService } from '@services/user/user.service';
import { RdvDialogTypes } from '@remote-display/rdv.enums';

@Component({
  selector: 'app-remote-display-dialog',
  templateUrl: './remote-display-dialog.component.html',
  styleUrls: ['./remote-display-dialog.component.css']
})
export class RemoteDisplayDialogComponent implements OnInit {
  public brandColor: any;
  public tvInstallUrl: string;
  public rdvDialogTypes = RdvDialogTypes;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RemoteDisplayDialogComponent>,
    private _appSettings: AppSettingsService,
    private _userService: UserService
  ) {}

  ngOnInit() {
    this.brandColor = this._userService.getBrand() === 'Case IH' ? BrandColors.CIH : BrandColors.NH;
    this.tvInstallUrl = this._appSettings.rdvSettings.tvAppInstall;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  endSession() {
    this.dialogRef.close('END_SESSION');
  }
}
