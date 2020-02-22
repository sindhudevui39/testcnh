import { TestBed, inject } from '@angular/core/testing';

import { FilterUtilService } from './filter-util.service';

describe('FilterUtilService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilterUtilService]
    });
  });

  it('should be created', inject([FilterUtilService], (service: FilterUtilService) => {
    expect(service).toBeTruthy();
  }));
});
