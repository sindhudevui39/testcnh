import { TestBed, inject } from '@angular/core/testing';

import { AppSettingsService } from './app-settings.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppSettingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppSettingsService]
    });
  });

  it('should be created', inject([AppSettingsService], (service: AppSettingsService) => {
    expect(service).toBeTruthy();
  }));
});
