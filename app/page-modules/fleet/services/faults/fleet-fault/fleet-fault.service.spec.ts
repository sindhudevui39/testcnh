import { TestBed, inject } from '@angular/core/testing';

import { FleetFaultService } from './fleet-fault.service';

describe('FleetFaultService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FleetFaultService]
    });
  });

  it('should be created', inject([FleetFaultService], (service: FleetFaultService) => {
    expect(service).toBeTruthy();
  }));
});
