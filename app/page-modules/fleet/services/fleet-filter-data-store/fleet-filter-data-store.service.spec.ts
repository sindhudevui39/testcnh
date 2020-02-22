import { TestBed, inject } from '@angular/core/testing';

import { FleetFilterDataStoreService } from './fleet-filter-data-store.service';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { UserService } from '@services/user/user.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';
import { ApiService } from '@services/api/api.service';
import { UtilService } from '@services/util/util.service';
import { FleetFilterService } from '../fleet-filter/fleet-filter.service';
import { FleetFilterEventsService } from '../events/fleet-filter-events.service';
import { FleetHistroyNotificationService } from '@services/fleet-histroy-notification/fleet-histroy-notification.service';
import { FleetOverviewService } from '@fleet/pages/fleet-overview/services/fleet-overview-data/fleet-overview.service';
import { user } from 'src/app/test-constants/User';
import { FilterUtilService } from '@services/filter-util/filter-util.service';

describe('FleetFilterDataStoreService', () => {
  let httpMock: HttpTestingController;
  let userService: UserService;
  let apiService: ApiService;
  let filterUtilService: FilterUtilService;
  let filterEventsService: FleetFilterEventsService;
  let fleetHistroyNotificationService: FleetHistroyNotificationService;
  let fleetOverviewService: FleetOverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AppRoutingModule],
      providers: [
        UserService,
        ApiService,
        FilterUtilService,
        FleetFilterEventsService,
        FleetHistroyNotificationService,
        FleetOverviewService,
        {
          provide: 'window',
          useValue: window
        },
        {
          provide: APP_BASE_HREF,
          useValue: '/'
        }
      ]
    });

    userService = TestBed.get(UserService);
    userService.user = user;
    apiService = TestBed.get(ApiService);
    filterUtilService = TestBed.get(FilterUtilService);
    filterEventsService = TestBed.get(FleetFilterEventsService);
    fleetHistroyNotificationService = TestBed.get(FleetHistroyNotificationService);
    fleetOverviewService = TestBed.get(FleetOverviewService);

    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', inject(
    [FleetFilterDataStoreService],
    (service: FleetFilterDataStoreService) => {
      userService.user['isDealer'] = false;
      expect(service).toBeTruthy();
    }
  ));
  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpMock.verify();
  });
});
