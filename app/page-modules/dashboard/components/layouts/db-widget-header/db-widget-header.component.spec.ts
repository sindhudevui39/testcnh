import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbWidgetHeaderComponent } from './db-widget-header.component';
import { CustomMaterialModule } from '@shared-modules/custom-material/custom-material.module';

describe('DbWidgetHeaderComponent', () => {
  let component: DbWidgetHeaderComponent;
  let fixture: ComponentFixture<DbWidgetHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CustomMaterialModule],
      declarations: [DbWidgetHeaderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbWidgetHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
