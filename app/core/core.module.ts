import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { AppService } from '@services/app/app.service';
import { AppSettingsService } from '@services/app-settings/app-settings.service';
import { AuthService } from '@services/auth/auth.service';
import { AutoLogoutService } from '@services/auto-logout/auto-logout.service';
import { EvoNotificationService } from '@services/evo-notification/evo-notification.service';
import { EvoSocketService } from '@services/evo-socket/evo-socket.service';
import { FileUploadService } from '@services/file-upload/file-upload.service';
import { FleetGuardService } from './guards/fleet-guard.service';
import { FleetHistroyNotificationService } from '@services/fleet-histroy-notification/fleet-histroy-notification.service';
import { IframeService } from '@services/iframe/iframe.service';
import { PingService } from '@services/ping/ping.service';
import { UserService } from '@services/user/user.service';

@NgModule({
  imports: [
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      headerName: 'XSRF-TOKEN'
    }),
    SharedModule,
    RouterModule
  ],
  declarations: [],
  providers: [
    AppService,
    AppSettingsService,
    AuthService,
    AutoLogoutService,
    EvoNotificationService,
    EvoSocketService,
    FleetGuardService,
    FleetHistroyNotificationService,
    FileUploadService,
    IframeService,
    PingService,
    UserService
  ],
  exports: [HttpClientModule]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    core: CoreModule
  ) {
    if (core) {
      throw new Error(
        `${
          core.constructor.name
        } has already been loaded. Import this module in the AppModule only.`
      );
    }
  }
}
