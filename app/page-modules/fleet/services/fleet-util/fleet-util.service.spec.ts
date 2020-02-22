import { TestBed, inject } from '@angular/core/testing';

import { FleetUtilService } from './fleet-util.service';

describe('FleetUtilService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FleetUtilService]
    });
  });

  it('should be created', inject([FleetUtilService], (service: FleetUtilService) => {
    expect(service).toBeTruthy();
  }));
});
