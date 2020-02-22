import { TestBed, inject } from '@angular/core/testing';

import { FleetHistroyNotificationService } from './fleet-histroy-notification.service';
import { UserService } from '@services/user/user.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { user } from 'src/app/test-constants/User';

describe('FleetHistroyNotificationService', () => {
  let userService: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [FleetHistroyNotificationService, UserService]
    });

    userService = TestBed.get(UserService);
    httpMock = TestBed.get(HttpTestingController);
    userService.user = user;
  });

  it('should be created', inject(
    [FleetHistroyNotificationService],
    (service: FleetHistroyNotificationService) => {
      service._userService.user['isDealer'] = userService.user['isDealer'];
      expect(service).toBeTruthy();
    }
  ));
});
