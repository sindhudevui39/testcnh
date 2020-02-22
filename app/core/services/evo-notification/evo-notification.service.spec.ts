import { TestBed, inject } from '@angular/core/testing';

import { EvoNotificationService } from './evo-notification.service';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material';

describe('EvoNotificationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, TranslateModule.forRoot(), MatDialogModule],
      providers: [EvoNotificationService]
    });
  });

  it('should be created', inject([EvoNotificationService], (service: EvoNotificationService) => {
    expect(service).toBeTruthy();
  }));
});
