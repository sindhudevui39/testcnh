import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material';

import { RemoteDisplayService } from '@remote-display/services/remote-display/remote-display.service';
import { RdvUiService } from '@remote-display/services/rdv-ui/rdv-ui.service';
import { UserService } from '@services/user/user.service';

import { RemoteDisplayDialogComponent } from '@shared-components/dialogs/remote-display-dialog/remote-display-dialog.component';

import { BrandColors } from '@enums/brand.enum';
import { ConnectionStatus, RdvDialogTypes } from '@remote-display/rdv.enums';
import { IConnectionStatus } from '@remote-display/rdv.models';

@Component({
  selector: 'app-remote-display-view',
  templateUrl: './remote-display-view.component.html',
  styleUrls: ['./remote-display-view.component.css']
})
export class RemoteDisplayViewComponent implements OnInit, OnChanges {
  @Input()
  rdvStatus: IConnectionStatus;

  public connectionStatus = ConnectionStatus;
  public brandColor: string;
  public currentStatus: string;

  constructor(
    private _rdvDialog: MatDialog,
    private _remoteDisplay: RemoteDisplayService,
    private _rdvUiService: RdvUiService,
    private _userService: UserService
  ) {}

  public ngOnInit() {
    this.brandColor = this._userService.getBrand() === 'Case IH' ? BrandColors.CIH : BrandColors.NH;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.currentStatus = changes['rdvStatus']['currentValue']['socketResponse']['connectionStatus'];
  }

  public endSession(): void {
    this._rdvDialog
      .open(
        RemoteDisplayDialogComponent,
        this._rdvUiService.getRdvDialogConfig(RdvDialogTypes.END_SESSION)
      )
      .afterClosed()
      .subscribe(data => {
        if (data === 'END_SESSION') {
          this._remoteDisplay.abortDeviceNotification('PAGE_RDV.TERMINATION_CLIENT');
        }
      });
  }

  public retry(): void {
    this._remoteDisplay.abortDeviceNotification('RETRY');
    this._remoteDisplay.enableRemoteDisplayView(true, {
      connectionStatus: ConnectionStatus.WAITING
    });
  }
}
