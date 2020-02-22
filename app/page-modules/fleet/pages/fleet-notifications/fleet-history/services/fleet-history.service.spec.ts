import { TestBed, inject } from '@angular/core/testing';

import { FleetHistoryService } from './fleet-history.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from '@services/user/user.service';
import { FleetPostNotificationService } from '../../fleet-manage/services/fleet-post-notification.service';
import { RouterTestingModule } from '@angular/router/testing';
import { user } from 'src/app/test-constants/User';
import { FleetUrls } from '@fleet/services/fleet-api/fleet-urls.enum';

describe('FleetHistoryService', () => {
  let httpMock: HttpTestingController;
  let userService: UserService;
  let postService: FleetPostNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FleetHistoryService,
        UserService,
        FleetPostNotificationService,
        {
          provide: 'window',
          useValue: window
        }
      ],
      imports: [HttpClientTestingModule, RouterTestingModule]
    });

    userService = TestBed.get(UserService);
    userService.user = user;
    postService = TestBed.get(FleetPostNotificationService);
    postService.userEmail = user.email;
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', inject([FleetHistoryService], (service: FleetHistoryService) => {
    expect(service).toBeTruthy();
  }));

  it('#getHistoryData should return an Observable<any[]>', inject(
    [FleetHistoryService],
    (service: FleetHistoryService) => {
      const dummyData = {};
      // We call the service
      service.getHistoryData().subscribe(data => {
        expect(data).toEqual(dummyData);
        expect(Object.keys(data).length).toBe(0);
      });
      // We set the expectations for the HttpClient mock
      const req = httpMock.expectOne(`${FleetUrls.FLEET_HISTORY}`);
      expect(req.request.method).toBe('GET');
      // Then we set the fake data to be returned by the mock
      req.flush(dummyData);
    }
  ));

  // it('#lastNotificationUpdate is called', inject(
  //   [FleetHistoryService],
  //   (service: FleetHistoryService) => {
  //     service.lastNotificationUpdate(false);
  //   }
  // ));

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));
});
