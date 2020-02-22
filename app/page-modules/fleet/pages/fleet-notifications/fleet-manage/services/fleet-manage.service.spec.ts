import { TestBed, inject } from '@angular/core/testing';

import { FleetManageService } from './fleet-manage.service';
import { UserService } from '@services/user/user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { user } from 'src/app/test-constants/User';
import { userResponse } from 'src/app/test-constants/fleet-notification-mock/fleet-mock-manage-data';

describe('FleetManageService', () => {
  let httpMock: HttpTestingController;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FleetManageService, UserService]
    });
    userService = TestBed.get(UserService);
    userService.user = user;
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', inject([FleetManageService], (service: FleetManageService) => {
    service.userEmail = userService['_user'].email;
    expect(service).toBeTruthy();
  }));

  it('should return a collection of customNotifications', inject(
    [FleetManageService],
    (service: FleetManageService) => {
      service.userEmail = userService['_user'].email;

      let response;
      spyOn(service, 'getCustomNotificationsData').and.returnValue(of(userResponse));

      service.getCustomNotificationsData().subscribe(res => {
        response = res;
      });

      expect(response).toEqual(userResponse);
    }
  ));

  it('should return a collection of userNotifications', inject(
    [FleetManageService],
    (service: FleetManageService) => {
      service.userEmail = userService['_user'].email;

      let response;
      spyOn(service, 'getUserNotificationsData').and.returnValue(of(userResponse));

      service.getUserNotificationsData().subscribe(res => {
        response = res;
      });

      expect(response).toEqual(userResponse);
    }
  ));
});
