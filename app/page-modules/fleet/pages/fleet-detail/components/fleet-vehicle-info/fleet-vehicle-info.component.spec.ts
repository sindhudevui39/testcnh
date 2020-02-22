import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetVehicleInfoComponent } from './fleet-vehicle-info.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatCardModule } from '@angular/material';

describe('FleetVehicleInfoComponent', () => {
  let component: FleetVehicleInfoComponent;
  let fixture: ComponentFixture<FleetVehicleInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateTestingModule.withTranslations({}),
        HttpClientTestingModule,
        MatCardModule
      ],
      declarations: [FleetVehicleInfoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetVehicleInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
