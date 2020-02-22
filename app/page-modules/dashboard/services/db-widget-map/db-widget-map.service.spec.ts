import { TestBed, inject } from '@angular/core/testing';

import { DbWidgetMapService } from './db-widget-map.service';

describe('DbWidgetMapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DbWidgetMapService]
    });
  });

  it('should be created', inject([DbWidgetMapService], (service: DbWidgetMapService) => {
    expect(service).toBeTruthy();
  }));
});
