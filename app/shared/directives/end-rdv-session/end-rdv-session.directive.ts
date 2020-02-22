import { Directive, HostListener } from '@angular/core';

import { EvoNotificationService } from '@services/evo-notification/evo-notification.service';
import { RemoteDisplayService } from '@remote-display/services/remote-display/remote-display.service';

@Directive({
  selector: '[appEndRdvSession]'
})
export class EndRdvSessionDirective {
  constructor(
    private _evoNotificationService: EvoNotificationService,
    private _remoteDisplay: RemoteDisplayService
  ) {}

  @HostListener('window:beforeunload', ['$event'])
  public endRdvSession(event: Event) {
    event.preventDefault();

    if (this._remoteDisplay.isRdvInitiated) {
      event.returnValue = true;
    }
  }

  @HostListener('window:unload', ['$event'])
  public endSession() {
    if (this._remoteDisplay.isRdvInitiated) {
      this._evoNotificationService.updateDeviceNotificationSync(
        this._remoteDisplay.vehicleId,
        this._remoteDisplay.requestId
      );
    }
  }
}
