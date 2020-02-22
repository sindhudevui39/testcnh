import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { FaviconModule } from './favicon/favicon.module';
import { RemoteDisplayModule } from '@remote-display/remote-display.module';
import { SharedModule } from './shared/shared.module';

import { AuthGuardService } from './core/guards/auth-guard.service';
import { CanDeactivateGuard } from './core/guards/can-deactivate.guard';
import { RequestInterceptor } from './http-interceptor';

import { AppComponent } from './app.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/common/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    FaviconModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: true
    }),
    RemoteDisplayModule
  ],
  providers: [
    DatePipe,
    {
      provide: 'window',
      useValue: window
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    },
    AuthGuardService,
    CanDeactivateGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
