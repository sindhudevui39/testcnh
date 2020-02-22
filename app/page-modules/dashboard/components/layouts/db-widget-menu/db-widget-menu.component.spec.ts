import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbWidgetMenuComponent } from './db-widget-menu.component';

describe('DbWidgetMenuComponent', () => {
  let component: DbWidgetMenuComponent;
  let fixture: ComponentFixture<DbWidgetMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbWidgetMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbWidgetMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
