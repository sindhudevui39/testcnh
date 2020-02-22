import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetVehicleSelectionModalComponent } from './fleet-vehicle-selection-modal.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { mockDialogRef } from 'src/app/test-constants/mat-dialog-ref.mock';

describe('FleetVehicleSelectionModalComponent', () => {
  let component: FleetVehicleSelectionModalComponent;
  let fixture: ComponentFixture<FleetVehicleSelectionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, MatDialogModule, TranslateTestingModule.withTranslations({})],
      declarations: [FleetVehicleSelectionModalComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: ''
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetVehicleSelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
