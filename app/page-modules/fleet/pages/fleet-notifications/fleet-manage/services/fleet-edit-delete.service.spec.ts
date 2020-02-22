import { TestBed, inject } from '@angular/core/testing';

import { FleetEditDeleteService } from '@fleet/pages/fleet-notifications/fleet-manage/services/fleet-edit-delete.service';
import { UserService } from '@services/user/user.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { user } from 'src/app/test-constants/User';

describe('FleetEditDeleteService', () => {
  let httpMock: HttpTestingController;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FleetEditDeleteService, UserService]
    });
    userService = TestBed.get(UserService);
    userService.user = user;
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', inject([FleetEditDeleteService], (service: FleetEditDeleteService) => {
    service.userEmail = userService['_user'].email;
    expect(service).toBeTruthy();
  }));
});
