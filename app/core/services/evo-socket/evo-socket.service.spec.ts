import { TestBed, inject } from '@angular/core/testing';

import { EvoSocketService } from './evo-socket.service';
import { AppSettingsService } from '@services/app-settings/app-settings.service';
import { HttpClientModule } from '@angular/common/http';

describe('EvoSocketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [EvoSocketService, AppSettingsService]
    });
  });

  it('should be created', inject([EvoSocketService], (service: EvoSocketService) => {
    expect(service).toBeTruthy();
  }));
});
