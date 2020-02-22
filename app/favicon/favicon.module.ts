import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FaviconService, BROWSER_FAVICONS_CONFIG } from './favicon.service';

@NgModule({
  imports: [BrowserModule],

  providers: [
    {
      provide: FaviconService
    },
    {
      provide: BROWSER_FAVICONS_CONFIG,
      useValue: {
        icons: {
          dashboard: {
            href: 'assets/favicons/icon-dashboard.png'
          },
          data: {
            href: 'assets/favicons/icon-data-app.png',
            isDefault: true
          },
          farm: {
            href: 'assets/favicons/icon-farm-app.png'
          },
          fleet: {
            href: 'assets/favicons/icon-fleet-app.png'
          }
        },

        cacheBusting: true
      }
    }
  ]
})
export class FaviconModule {
  static forRoot() {
    return {
      ngModule: FaviconModule,
      providers: [FaviconService]
    };
  }
}
