import { TestBed, inject } from '@angular/core/testing';

import { FleetOverviewSortService } from './fleet-overview-sort.service';

describe('FleetOverviewSortService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FleetOverviewSortService]
    });
  });

  it('should be created', inject([FleetOverviewSortService], (service: FleetOverviewSortService) => {
    expect(service).toBeTruthy();
  }));
});
