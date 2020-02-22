import { NgModule, Optional, SkipSelf } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { RdvUiService } from './services/rdv-ui/rdv-ui.service';
import { RemoteDisplayService } from './services/remote-display/remote-display.service';
import { RemoteDisplayUtilService } from './services/remote-display-util/remote-display-util.service';
import { ResetRemoteDisplayService } from './services/reset-remote-display/reset-remote-display.service';
import { TranslatedRDVLabelStoreService } from './services/translated-rdv-label-store/translated-rdv-label-store.service';

@NgModule({
  imports: [SharedModule],
  providers: [
    RdvUiService,
    RemoteDisplayService,
    RemoteDisplayUtilService,
    ResetRemoteDisplayService,
    TranslatedRDVLabelStoreService
  ]
})
export class RemoteDisplayModule {
  constructor(
    @Optional()
    @SkipSelf()
    remoteDisplay: RemoteDisplayModule
  ) {
    if (remoteDisplay) {
      throw new Error(
        `${remoteDisplay.constructor.name} has already been loaded. Import this module only once.`
      );
    }
  }
}
