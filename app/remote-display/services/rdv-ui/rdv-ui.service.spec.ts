import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule, MatDialogModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { RdvUiService } from './rdv-ui.service';

describe('RdvUiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule,
        HttpClientTestingModule,
        MatDialogModule,
        TranslateModule.forRoot()
      ],
      providers: [
        RdvUiService,
        {
          provide: 'window',
          useValue: window
        }
      ]
    });
  });

  it('should be created', inject([RdvUiService], (service: RdvUiService) => {
    expect(service).toBeTruthy();
  }));
});
