import { TestBed, inject } from '@angular/core/testing';

import { ToolbarToggleFilterbarService } from './toolbar-toggle-filterbar.service';

describe('ToolbarToggleFilterbarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToolbarToggleFilterbarService]
    });
  });

  it('should be created', inject([ToolbarToggleFilterbarService], (service: ToolbarToggleFilterbarService) => {
    expect(service).toBeTruthy();
  }));
});
