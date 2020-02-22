import { TestBed, inject } from '@angular/core/testing';

import { FotaService } from './fota.service';

describe('FotaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FotaService]
    });
  });

  it('should be created', inject([FotaService], (service: FotaService) => {
    expect(service).toBeTruthy();
  }));
});
