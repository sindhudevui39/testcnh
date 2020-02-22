import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetToolbarDisplayInfoComponent } from './fleet-toolbar-display-info.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '@services/user/user.service';
import { FleetDataService } from '@fleet/services/fleet-data.service';
import { FleetFilterDataStoreService } from '@fleet/services/fleet-filter-data-store/fleet-filter-data-store.service';
import { SelectedVehicleService } from '@fleet/services/events/selected-vehicle.service';
import { user } from 'src/app/test-constants/User';
import { LoaderComponent } from '@shared-modules/loading/loader.component';
import { MatDialogModule } from '@angular/material';

describe('FleetToolbarDisplayInfoComponent', () => {
  let userService: UserService;
  let fleetFilterDataStoreService: FleetFilterDataStoreService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppRoutingModule,
        MatDialogModule,
        HttpClientModule,
        TranslateTestingModule.withTranslations({})
      ],
      declarations: [FleetToolbarDisplayInfoComponent, LoaderComponent],
      providers: [
        {
          provide: 'window',
          useValue: window
        },
        {
          provide: APP_BASE_HREF,
          useValue: '/'
        },
        FleetDataService,
        FleetFilterDataStoreService,
        SelectedVehicleService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    userService = TestBed.get(UserService);
    userService.user = user;

    fleetFilterDataStoreService = TestBed.get(FleetFilterDataStoreService);
    fleetFilterDataStoreService._userService.user['isDealer'] = userService.user['isDealer'];
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FleetToolbarDisplayInfoComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
