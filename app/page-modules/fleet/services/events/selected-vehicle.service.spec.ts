import { TestBed, inject } from '@angular/core/testing';

import { SelectedVehicleService } from './selected-vehicle.service';

describe('SelectedVehicleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectedVehicleService]
    });
  });

  it('should be created', inject([SelectedVehicleService], (service: SelectedVehicleService) => {
    expect(service).toBeTruthy();
  }));
});
