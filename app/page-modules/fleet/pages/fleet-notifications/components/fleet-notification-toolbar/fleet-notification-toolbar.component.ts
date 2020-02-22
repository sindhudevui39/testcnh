import { Component, OnInit } from '@angular/core';
import { BrandNames } from '@enums/brand.enum';
import { UserService } from '@services/user/user.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FleetManageService } from '@fleet/pages/fleet-notifications/fleet-manage/services/fleet-manage.service';
import { FleetHistoryService } from '@fleet/pages/fleet-notifications/fleet-history/services/fleet-history.service';

@Component({
  selector: 'app-fleet-notification-toolbar',
  templateUrl: './fleet-notification-toolbar.component.html',
  styleUrls: ['./fleet-notification-toolbar.component.css']
})
export class FleetNotificationToolbarComponent implements OnInit {
  routes = [
    {
      label: 'Operation Data',
      route: '/operations'
    },
    {
      label: 'Setup Data',
      route: '/setup'
    }
  ];
  brand: string;
  brands = BrandNames;
  manageTab = true;
  historyTab = false;
  currentTab: string;
  subTab: string;
  notificationCount: number;
  createdByMe = 0;
  createdForMe = 0;
  createdForMeData: any;
  createdByMeData: any;

  constructor(
    private userService: UserService,
    private location: Location,
    private router: Router,
    private fleetManageService: FleetManageService,
    private fleetHistoryService: FleetHistoryService
  ) {
    router.events.subscribe(val => {
      this.setCurrentTab();
    });

    this.setCurrentTab();
  }

  ngOnInit() {
    this.brand = this.userService.getBrand();

    this.currentTab = this.location
      .path()
      .substring(1)
      .split('/')[1];
  }

  setCurrentTab() {
    const currentLocation = this.location
      .path()
      .substring(1)
      .split('/')[1];

    this.subTab = this.location
      .path()
      .substring(1)
      .split('/')[2];

    this.manageTab = this.subTab === 'manage' ? true : false;
    this.historyTab = this.subTab === 'history' ? true : false;

    if (currentLocation === 'field-data') {
      this.currentTab = 'field-data';
    } else if (currentLocation === 'notifications') {
      this.currentTab = 'notifications';

      if (this.subTab === 'manage') {
        this.fleetManageService.createdByMeCount$.subscribe((count: number) => {
          this.createdByMe = count;

          this.createdByMeData = {
            count
          };

          this.notificationCount = this.createdByMe + this.createdForMe;
        });

        this.fleetManageService.createdForMeCount$.subscribe((count: number) => {
          this.createdForMe = count;

          this.createdForMeData = {
            count
          };

          this.notificationCount = this.createdByMe + this.createdForMe;
        });
      } else {
        this.fleetHistoryService.notificationCount$.subscribe((count: number) => {
          this.notificationCount = count;
        });
      }
    } else {
      this.currentTab = '';
    }
  }
}
