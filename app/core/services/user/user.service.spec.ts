import { TestBed, getTestBed, async } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Urls } from '@enums/urls.enum';
import { user } from 'src/app/test-constants/User';

describe('UserService', () => {
  let injector: TestBed;
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    injector = getTestBed();
    service = injector.get(UserService);
    httpMock = injector.get(HttpTestingController);

    service.user = user;
  });

  it('should return an Observable<any>', async(() => {
    const dummyUsers = {};
    const api = 'api/get/userprofile';

    service.getUserDetails().subscribe(users => {
      expect(users.url).toEqual(api);
      expect(users.body).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne(`${Urls.USER_DETAILS}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  }));
});
