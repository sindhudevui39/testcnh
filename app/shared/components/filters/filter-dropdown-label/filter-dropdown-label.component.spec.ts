import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDropdownLabelComponent } from './filter-dropdown-label.component';

describe('FilterDropdownLabelComponent', () => {
  let component: FilterDropdownLabelComponent;
  let fixture: ComponentFixture<FilterDropdownLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterDropdownLabelComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterDropdownLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
