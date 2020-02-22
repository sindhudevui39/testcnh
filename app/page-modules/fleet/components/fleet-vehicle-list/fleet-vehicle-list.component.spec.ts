import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetVehicleListComponent } from './fleet-vehicle-list.component';
import { WordWrapTooltipComponent } from '@shared-components/word-wrap-tooltip/word-wrap-tooltip.component';
import { SearchHighlightPipe } from '@fleet/pipes/search-highlight.pipe';

describe('FleetVehicleListComponent', () => {
  let component: FleetVehicleListComponent;
  let fixture: ComponentFixture<FleetVehicleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [FleetVehicleListComponent, WordWrapTooltipComponent, SearchHighlightPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetVehicleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
