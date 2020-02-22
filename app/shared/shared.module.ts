import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { sharedComponents } from './shared-component-imports';
import { sharedDirectives } from './shared-directive-imports';
import { sharedEntryComponents } from './shared-entry-component-imports';
import { sharedModules } from './shared-module-imports';
import { sharedPipes } from './shared-pipe-imports';
import { RemoteDisplayDialogComponent } from './components/dialogs/remote-display-dialog/remote-display-dialog.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/common/', '.json');
}

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  imports: [
    RouterModule,
    ...sharedModules,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: true
    })
  ],
  declarations: [
    ...sharedDirectives,
    ...sharedComponents,
    ...sharedEntryComponents,
    ...sharedPipes,
    RemoteDisplayDialogComponent
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  exports: [...sharedComponents, ...sharedModules, ...sharedDirectives, ...sharedPipes],
  entryComponents: [...sharedEntryComponents]
})
export class SharedModule {}
