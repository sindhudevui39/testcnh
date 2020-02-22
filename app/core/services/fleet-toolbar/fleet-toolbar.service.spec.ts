import { TestBed, inject } from '@angular/core/testing';

import { FleetToolbarService } from './fleet-toolbar.service';

describe('FleetToolbarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FleetToolbarService]
    });
  });

  it('should be created', inject([FleetToolbarService], (service: FleetToolbarService) => {
    expect(service).toBeTruthy();
  }));
});
