import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDropdownComponent } from './filter-dropdown.component';
import { FilterDropdownLabelComponent } from '../filter-dropdown-label/filter-dropdown-label.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { HttpClientModule } from '@angular/common/http';

describe('FilterDropdownComponent', () => {
  let component: FilterDropdownComponent;
  let fixture: ComponentFixture<FilterDropdownComponent>;

  const dropdownName = 'test';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, PerfectScrollbarModule],
      declarations: [FilterDropdownComponent, FilterDropdownLabelComponent],
      providers: [
        {
          provide: 'window',
          useValue: window
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterDropdownComponent);
    component = fixture.componentInstance;
    component.dropdownName = dropdownName;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
