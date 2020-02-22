import { TestBed, inject } from '@angular/core/testing';

import { FleetVehicleSelectService } from './fleet-vehicle-select.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

describe('FleetVehicleSelectService', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FleetVehicleSelectService]
    });

    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', inject(
    [FleetVehicleSelectService],
    (service: FleetVehicleSelectService) => {
      expect(service).toBeTruthy();
    }
  ));
});
