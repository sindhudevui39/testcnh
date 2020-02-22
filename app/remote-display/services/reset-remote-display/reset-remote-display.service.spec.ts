import { TestBed, inject } from '@angular/core/testing';

import { ResetRemoteDisplayService } from './reset-remote-display.service';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ResetRemoteDisplayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateTestingModule.withTranslations({}), HttpClientTestingModule],
      providers: [ResetRemoteDisplayService]
    });
  });

  it('should be created', inject(
    [ResetRemoteDisplayService],
    (service: ResetRemoteDisplayService) => {
      expect(service).toBeTruthy();
    }
  ));
});
