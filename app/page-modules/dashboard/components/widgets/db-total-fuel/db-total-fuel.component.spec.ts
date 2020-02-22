import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbWidgetHeaderComponent } from '@dashboard/components/layouts/db-widget-header/db-widget-header.component';
import { DbWidgetMenuComponent } from '@dashboard/components/layouts/db-widget-menu/db-widget-menu.component';
import { CustomMaterialModule } from '@shared-modules/custom-material/custom-material.module';
import { LoadingModule } from '@shared-modules/loading/loading.module';

import { DbTotalFuelComponent } from './db-total-fuel.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DbTotalFuelComponent', () => {
  let component: DbTotalFuelComponent;
  let fixture: ComponentFixture<DbTotalFuelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CustomMaterialModule, LoadingModule],
      declarations: [DbTotalFuelComponent, DbWidgetHeaderComponent, DbWidgetMenuComponent],
      providers: [
        {
          provide: 'window',
          useValue: window
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbTotalFuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
