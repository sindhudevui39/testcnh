import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackBarComponent } from './snack-bar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule, MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material';

describe('SnackBarComponent', () => {
  let component: SnackBarComponent;
  let fixture: ComponentFixture<SnackBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SnackBarComponent],
      imports: [HttpClientTestingModule, MatSnackBarModule],
      providers: [
        {
          provide: MatSnackBarRef,
          useValue: {}
        },
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: {} // Add any data you wish to test if it is passed/used correctly
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(SnackBarComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
