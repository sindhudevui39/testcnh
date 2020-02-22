import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbVehicleItemComponent } from './db-vehicle-item.component';

describe('DbVehicleItemComponent', () => {
  let component: DbVehicleItemComponent;
  let fixture: ComponentFixture<DbVehicleItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbVehicleItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbVehicleItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
