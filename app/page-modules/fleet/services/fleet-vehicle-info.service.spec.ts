import { TestBed, inject } from '@angular/core/testing';

import { FleetVehicleInfoService } from './fleet-vehicle-info.service';

describe('FleetVehicleInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FleetVehicleInfoService]
    });
  });

  it('should be created', inject([FleetVehicleInfoService], (service: FleetVehicleInfoService) => {
    expect(service).toBeTruthy();
  }));
});
