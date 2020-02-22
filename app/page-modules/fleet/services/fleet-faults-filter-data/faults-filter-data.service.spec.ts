import { TestBed, inject } from '@angular/core/testing';

import { FaultsFilterDataService } from './faults-filter-data.service';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { APP_BASE_HREF } from '@angular/common';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { UtilService } from '@services/util/util.service';
import { UserService } from '@services/user/user.service';
import { user } from 'src/app/test-constants/User';
import { MatDialogModule } from '@angular/material';
import { FleetService } from '../fleet.service';
import { FilterUtilService } from '@services/filter-util/filter-util.service';
import { FleetFilterEventsService } from '../events/fleet-filter-events.service';
import { FleetFilterService } from '../fleet-filter/fleet-filter.service';

describe('FaultsFilterDataService', () => {
  let httpMock: HttpTestingController;
  let utilService: UtilService;
  let userService: UserService;
  let fleetService: FleetService;
  let filterUtiltService: FilterUtilService;
  let fleetFilterEventsService: FleetFilterEventsService;
  let fleetFilterService: FleetFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, AppRoutingModule],
      providers: [
        FaultsFilterDataService,
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
    httpMock = TestBed.get(HttpTestingController);

    utilService = TestBed.get(UtilService);
    userService = TestBed.get(UserService);
    userService.user = user;
    fleetService = TestBed.get(FleetService);
    filterUtiltService = TestBed.get(FilterUtilService);
    fleetFilterEventsService = TestBed.get(FleetFilterEventsService);
    fleetFilterService = TestBed.get(FleetFilterService);
  });

  it('should be created', inject([FaultsFilterDataService], (service: FaultsFilterDataService) => {
    expect(service).toBeTruthy();
  }));
});
