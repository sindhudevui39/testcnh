import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ApiService } from './api.service';
import { UserService } from '@services/user/user.service';
import { UtilService } from '@services/util/util.service';
import { FleetUrls } from '@fleet/services/fleet-api/fleet-urls.enum';

describe('ApiService', () => {
  let injector: TestBed;
  let service: ApiService;
  let httpMock: HttpTestingController;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        UserService,
        UtilService,
        {
          provide: 'window',
          useValue: window
        }
      ]
    });
    injector = getTestBed();
    service = injector.get(ApiService);
    httpMock = injector.get(HttpTestingController);
    userService = injector.get(UserService);
  });

  it('#getVehicleData should return a observable', () => {
    const dummyData = [];
    service.getVehicleData().subscribe(data => {
      expect(data).toEqual(dummyData);
    });
    const req = httpMock.expectOne(FleetUrls.VEHICLE_DATA);
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });

  it('#getFaultsData should return a observable', () => {
    const dummyData = [];
    service.getFaultsData().subscribe(data => {
      expect(data).toEqual(dummyData);
    });
    const req = httpMock.expectOne(`api/get/faults`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });
});
