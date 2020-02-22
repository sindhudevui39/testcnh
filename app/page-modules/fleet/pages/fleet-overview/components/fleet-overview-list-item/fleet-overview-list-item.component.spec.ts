import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetOverviewListItemComponent } from './fleet-overview-list-item.component';

describe('FleetOverviewListItemComponent', () => {
  let component: FleetOverviewListItemComponent;
  let fixture: ComponentFixture<FleetOverviewListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetOverviewListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetOverviewListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
