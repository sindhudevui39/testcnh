import { TestBed, inject } from '@angular/core/testing';

import { FaviconService, BROWSER_FAVICONS_CONFIG } from './favicon.service';
import { FaviconModule } from './favicon.module';

describe('FaviconService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FaviconModule],
      providers: [FaviconService]
    });
  });

  it('should be created', inject([FaviconService], (service: FaviconService) => {
    expect(service).toBeTruthy();
  }));
});
