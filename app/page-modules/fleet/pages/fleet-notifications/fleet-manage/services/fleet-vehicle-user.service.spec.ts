import { TestBed, inject } from '@angular/core/testing';

import { FleetVehicleUserService } from '@fleet/pages/fleet-notifications/fleet-manage/services/fleet-vehicle-user.service';

describe('FleetVehicleUserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FleetVehicleUserService]
    });
  });

  it('should be created', inject([FleetVehicleUserService], (service: FleetVehicleUserService) => {
    expect(service).toBeTruthy();
  }));
});
