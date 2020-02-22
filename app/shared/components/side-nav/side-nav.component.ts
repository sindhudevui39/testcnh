import { Component, Input, OnInit, Inject } from '@angular/core';
import { BrandNames } from '@enums/brand.enum';

import { AppSettingsService } from '@services/app-settings/app-settings.service';
import { UserService } from '@services/user/user.service';
import { filter } from 'rxjs/operators';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {
  @Input('brand')
  brand: string;
  @Input('open')
  open: boolean;
  brands = BrandNames;
  hasDashboardAccess: boolean;
  currentRoute: string;

  constructor(
    private _router: Router,
    @Inject('window') private _window: Window,
    public appSettingsService: AppSettingsService,
    public userService: UserService
  ) {}

  ngOnInit() {
    this._router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe(event => {
      const route: string = event['url'].split('/')[1].toUpperCase();

      this.currentRoute = route;
    });

    this.userService.hasDashboardAccess$.pipe(filter(val => val !== null)).subscribe(val => {
      if (val) {
        this.hasDashboardAccess = true;
      } else {
        this.hasDashboardAccess = false;
      }
    });

    this.currentRoute = this._router.url.split('/')[1].toUpperCase();
  }

  redirect(url: string) {
    if (this.currentRoute !== url) {
      switch (url) {
        case 'FLEET':
          this._window.location.href = this.appSettingsService.appSettings.fleetRedirect;
          break;
        case 'DATA':
          this._window.location.href = this.appSettingsService.appSettings.dataRedirect;
          break;
      }
    }
  }
}
