import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetFirmwareCloseModalComponent } from './fleet-firmware-close-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule, MatDialogRef } from '@angular/material';
import { mockDialogRef } from 'src/app/test-constants/mat-dialog-ref.mock';

describe('FleetFirmwareCloseModalComponent', () => {
  let component: FleetFirmwareCloseModalComponent;
  let fixture: ComponentFixture<FleetFirmwareCloseModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, TranslateModule.forRoot(), MatDialogModule],
      declarations: [FleetFirmwareCloseModalComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetFirmwareCloseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
