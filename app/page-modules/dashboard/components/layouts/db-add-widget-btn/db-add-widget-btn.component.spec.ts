import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbAddWidgetBtnComponent } from './db-add-widget-btn.component';

describe('DbAddWidgetBtnComponent', () => {
  let component: DbAddWidgetBtnComponent;
  let fixture: ComponentFixture<DbAddWidgetBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbAddWidgetBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbAddWidgetBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
