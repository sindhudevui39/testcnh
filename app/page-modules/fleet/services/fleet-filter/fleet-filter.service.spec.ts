import { TestBed, inject } from '@angular/core/testing';

import { FleetFilterService } from './fleet-filter.service';

describe('FleetFilterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FleetFilterService]
    });
  });

  it('should be created', inject([FleetFilterService], (service: FleetFilterService) => {
    expect(service).toBeTruthy();
  }));
});
