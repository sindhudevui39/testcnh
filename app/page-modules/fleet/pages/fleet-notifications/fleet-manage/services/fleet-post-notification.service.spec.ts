import { TestBed, inject, getTestBed } from '@angular/core/testing';

import { FleetPostNotificationService } from '@fleet/pages/fleet-notifications/fleet-manage/services/fleet-post-notification.service';
import { UserService } from '@services/user/user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { user } from 'src/app/test-constants/User';

describe('FleetPostNotificationService', () => {
  let httpMock: HttpTestingController;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FleetPostNotificationService, UserService]
    });

    userService = TestBed.get(UserService);
    userService.user = user;
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', inject(
    [FleetPostNotificationService],
    (service: FleetPostNotificationService) => {
      userService.user = user;
      service.userEmail = userService.user['email'];
      expect(service).toBeTruthy();
    }
  ));
});
