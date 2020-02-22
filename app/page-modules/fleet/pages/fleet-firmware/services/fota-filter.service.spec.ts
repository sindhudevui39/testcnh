import { TestBed, inject } from '@angular/core/testing';

import { FotaFilterService } from './fota-filter.service';

describe('FotaFilterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FotaFilterService]
    });
  });

  it('should be created', inject([FotaFilterService], (service: FotaFilterService) => {
    expect(service).toBeTruthy();
  }));
});
