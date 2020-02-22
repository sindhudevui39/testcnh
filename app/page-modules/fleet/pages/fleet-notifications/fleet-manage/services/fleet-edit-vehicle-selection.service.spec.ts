import { TestBed, inject } from '@angular/core/testing';

import { FleetEditVehicleSelectionService } from './fleet-edit-vehicle-selection.service';
import { HttpClientModule } from '@angular/common/http';

describe('FleetEditVehicleSelectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [FleetEditVehicleSelectionService]
    });
  });

  it('should be created', inject(
    [FleetEditVehicleSelectionService],
    (service: FleetEditVehicleSelectionService) => {
      expect(service).toBeTruthy();
    }
  ));
});
