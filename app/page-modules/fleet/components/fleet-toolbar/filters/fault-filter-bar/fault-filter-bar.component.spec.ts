import { async, TestBed } from '@angular/core/testing';

import { FaultFilterBarComponent } from './fault-filter-bar.component';
import { DropdownComponent } from '@shared-components/dropdown/dropdown.component';
import { FilterDropdownComponent } from '@shared-components/filters/filter-dropdown/filter-dropdown.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FilterDropdownLabelComponent } from '@shared-components/filters/filter-dropdown-label/filter-dropdown-label.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { APP_BASE_HREF } from '@angular/common';
import { FleetFilterDataStoreService } from '@fleet/services/fleet-filter-data-store/fleet-filter-data-store.service';
import { MatDialogModule } from '@angular/material';
import { UserService } from '@services/user/user.service';
import { user } from 'src/app/test-constants/User';

describe('FaultFilterBarComponent', () => {
  let userService: UserService;
  let fleetFilterDataStoreService: FleetFilterDataStoreService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PerfectScrollbarModule, MatDialogModule, HttpClientModule, AppRoutingModule],
      declarations: [
        FaultFilterBarComponent,
        FilterDropdownComponent,
        FilterDropdownLabelComponent,
        DropdownComponent
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
    const fixture = TestBed.createComponent(FaultFilterBarComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
