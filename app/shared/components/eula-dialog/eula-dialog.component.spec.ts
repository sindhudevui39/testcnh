import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MatDialogRef } from '@angular/material';
import { EulaDialogComponent } from './eula-dialog.component';
import { AuthService } from '@services/auth/auth.service';
import { UserService } from '@services/user/user.service';
import { mockDialogRef } from 'src/app/test-constants/mat-dialog-ref.mock';
import { TranslateTestingModule } from 'ngx-translate-testing';

describe('EulaDialogComponent', () => {
  let component: EulaDialogComponent;
  let fixture: ComponentFixture<EulaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateTestingModule.withTranslations({})],
      declarations: [EulaDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        },
        {
          provide: 'window',
          useValue: window
        },
        AuthService,
        UserService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EulaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
