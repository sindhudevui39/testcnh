import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetFirmwareConfirmationComponent } from './fleet-firmware-confirmation.component';
import { TranslateModule } from '@ngx-translate/core';

describe('FleetFirmwareConfirmationComponent', () => {
  let component: FleetFirmwareConfirmationComponent;
  let fixture: ComponentFixture<FleetFirmwareConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [FleetFirmwareConfirmationComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetFirmwareConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
