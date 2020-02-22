import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetCandataParameterComponent } from './fleet-candata-parameter.component';

describe('FleetCandataParameterComponent', () => {
  let component: FleetCandataParameterComponent;
  let fixture: ComponentFixture<FleetCandataParameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetCandataParameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetCandataParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
