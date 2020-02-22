import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogRef } from '@angular/material';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { LogoutDialogComponent } from './logout-dialog.component';
import { CustomMaterialModule } from '@shared-modules/custom-material/custom-material.module';
import { mockDialogRef } from 'src/app/test-constants/mat-dialog-ref.mock';

describe('LogoutDialogComponent', () => {
  let component: LogoutDialogComponent;
  let fixture: ComponentFixture<LogoutDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CustomMaterialModule,
        HttpClientModule,
        TranslateTestingModule.withTranslations({})
      ],
      declarations: [LogoutDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        },
        {
          provide: 'window',
          useValue: window
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
