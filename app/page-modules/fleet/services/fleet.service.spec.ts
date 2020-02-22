import { TestBed, inject } from '@angular/core/testing';

import { FleetService } from './fleet.service';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { APP_BASE_HREF } from '@angular/common';
import { FleetFilterDataStoreService } from './fleet-filter-data-store/fleet-filter-data-store.service';
import { ApiService } from '@services/api/api.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { user } from 'src/app/test-constants/User';
import { UserService } from '@services/user/user.service';
import { MatDialogModule } from '@angular/material';

describe('FleetService', () => {
  let httpMock: HttpTestingController;
  let apiService: ApiService;
  let userService: UserService;
  let fleetFilterDataStoreService: FleetFilterDataStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, MatDialogModule, HttpClientTestingModule, AppRoutingModule],
      providers: [
        FleetService,
        {
          provide: 'window',
          useValue: window
        },
        {
          provide: APP_BASE_HREF,
          useValue: '/'
        },
        FleetFilterDataStoreService,
        ApiService
      ]
    });

    apiService = TestBed.get(ApiService);
    userService = TestBed.get(UserService);
    userService.user = user;
    fleetFilterDataStoreService = TestBed.get(FleetFilterDataStoreService);
    fleetFilterDataStoreService._userService.user['isDealer'] = userService.user['isDealer'];

    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', inject([FleetService], (service: FleetService) => {
    fleetFilterDataStoreService._userService.user['isDealer'] = userService.user['isDealer'];
    expect(service).toBeTruthy();
  }));
});
