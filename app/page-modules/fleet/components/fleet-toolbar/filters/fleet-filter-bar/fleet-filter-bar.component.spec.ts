import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetFilterBarComponent } from './fleet-filter-bar.component';
import { FilterDropdownComponent } from '@shared-components/filters/filter-dropdown/filter-dropdown.component';
import { FilterDropdownLabelComponent } from '@shared-components/filters/filter-dropdown-label/filter-dropdown-label.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { APP_BASE_HREF } from '@angular/common';
import { UserService } from '@services/user/user.service';
import { FleetFilterDataStoreService } from '@fleet/services/fleet-filter-data-store/fleet-filter-data-store.service';
import { user } from 'src/app/test-constants/User';

describe('FleetFilterBarComponent', () => {
  let userService: UserService;
  let fleetFilterDataStoreService: FleetFilterDataStoreService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        PerfectScrollbarModule,
        AppRoutingModule,
        HttpClientModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        FleetFilterBarComponent,
        FilterDropdownComponent,
        FilterDropdownLabelComponent
      ],
      providers: [
        {
          provide: 'window',
          useValue: window
        },
        {
          provide: APP_BASE_HREF,
          useValue: '/'
        },
        FleetFilterDataStoreService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    userService = TestBed.get(UserService);
    userService.user = user;

    fleetFilterDataStoreService = TestBed.get(FleetFilterDataStoreService);
    fleetFilterDataStoreService._userService.user = userService.user;
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FleetFilterBarComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
