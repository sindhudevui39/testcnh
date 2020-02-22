import { TestBed, inject } from '@angular/core/testing';

import { FleetDataService } from './fleet-data.service';

describe('FleetDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FleetDataService]
    });
  });

  it('should be created', inject([FleetDataService], (service: FleetDataService) => {
    expect(service).toBeTruthy();
  }));
});
