import { TestBed, inject } from '@angular/core/testing';

import { NavmapService } from './navmap.service';

describe('NavmapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NavmapService]
    });
  });

  it('should be created', inject([NavmapService], (service: NavmapService) => {
    expect(service).toBeTruthy();
  }));
});
