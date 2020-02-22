import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaultsListHeaderComponent } from './faults-list-header.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { APP_BASE_HREF } from '@angular/common';
import { user } from 'src/app/test-constants/User';
import { UserService } from '@services/user/user.service';
import { FleetFilterDataStoreService } from '@fleet/services/fleet-filter-data-store/fleet-filter-data-store.service';
import { MatDialogModule } from '@angular/material';

describe('FaultsListHeaderComponent', () => {
  let userService: UserService;
  let fleetFilterDataStoreService: FleetFilterDataStoreService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        AppRoutingModule,
        MatDialogModule,
        TranslateTestingModule.withTranslations({})
      ],
      declarations: [FaultsListHeaderComponent],
      providers: [
        {
          provide: 'window',
          useValue: window
        },
        {
          provide: APP_BASE_HREF,
          useValue: '/'
        }
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
    const fixture = TestBed.createComponent(FaultsListHeaderComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
