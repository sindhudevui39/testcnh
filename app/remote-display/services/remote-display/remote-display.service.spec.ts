import { TestBed, inject } from '@angular/core/testing';

import { RemoteDisplayService } from './remote-display.service';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule, MatDialogModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

describe('RemoteDisplayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, TranslateModule.forRoot(), MatDialogModule, MatSnackBarModule],
      providers: [
        RemoteDisplayService,
        {
          provide: 'window',
          useValue: window
        }
      ]
    });
  });

  it('should be created', inject([RemoteDisplayService], (service: RemoteDisplayService) => {
    expect(service).toBeTruthy();
  }));
});
