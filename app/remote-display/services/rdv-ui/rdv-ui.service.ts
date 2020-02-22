import { Injectable, Inject } from '@angular/core';
import { MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';

import { RemoteDisplayDialogComponent } from '@shared-components/dialogs/remote-display-dialog/remote-display-dialog.component';

import { ResetRemoteDisplayService } from '@remote-display/services/reset-remote-display/reset-remote-display.service';

import { RdvDialogTypes } from '@remote-display/rdv.enums';

@Injectable({
  providedIn: 'root'
})
export class RdvUiService {
  constructor(
    @Inject('window') private _window: Window,
    private _snackBar: MatSnackBar,
    private _rdvDialog: MatDialog,
    private resetRemoteService: ResetRemoteDisplayService
  ) {}

  public openRdvDialog(dialogType: string): void {
    this._rdvDialog.open(RemoteDisplayDialogComponent, this.getRdvDialogConfig(dialogType));
  }

  public openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: 4000
    });

    this.resetRemoteService.resetRemoteDisplay();
  }

  public getRdvDialogConfig(dialogType: string): MatDialogConfig {
    const dialog = new MatDialogConfig();

    dialog.panelClass = 'custom-dialog-container';

    dialog.data = {};
    dialog.data['type'] = dialogType;
    dialog.data['showCancel'] = false;
    dialog.data['showOk'] = true;

    switch (dialogType) {
      case RdvDialogTypes.INSTALL:
      case RdvDialogTypes.UNSUPPORTED_VERSION:
      case RdvDialogTypes.INACTIVE_SUBSCRIPTION:
        dialog.width = '728px';
        dialog.height = '228px';

        break;
      case RdvDialogTypes.END_SESSION:
        dialog.width = '400px';
        dialog.height = '250px';

        dialog.data['showCancel'] = true;
        dialog.data['showOk'] = false;

        break;
    }

    return dialog;
  }
}
