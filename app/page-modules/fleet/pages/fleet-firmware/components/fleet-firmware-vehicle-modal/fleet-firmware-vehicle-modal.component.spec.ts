import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetFirmwareVehicleModalComponent } from './fleet-firmware-vehicle-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule, MatDialogRef } from '@angular/material';
import { mockDialogRef } from 'src/app/test-constants/mat-dialog-ref.mock';

describe('FleetFirmwareVehicleModalComponent', () => {
  let component: FleetFirmwareVehicleModalComponent;
  let fixture: ComponentFixture<FleetFirmwareVehicleModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, TranslateModule.forRoot(), MatDialogModule],
      declarations: [FleetFirmwareVehicleModalComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetFirmwareVehicleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
