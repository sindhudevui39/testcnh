import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbFaultItemComponent } from './db-fault-item.component';
import { Fault } from '@dashboard/models/db-fault.model';

describe('DbFaultItemComponent', () => {
  let component: DbFaultItemComponent;
  let fixture: ComponentFixture<DbFaultItemComponent>;

  const faulty: Fault = {
    id: 1,
    faultName: 'Fault',
    companyName: 'Company',
    vehicleName: 'Vehicle',
    vehicleId: '123',
    faultTime: 'Time',
    model: 'vehicle model'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DbFaultItemComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbFaultItemComponent);
    component = fixture.componentInstance;

    component.fault = faulty;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
