import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { CustomMaterialModule } from '@shared-modules/custom-material/custom-material.module';
import { LoadingModule } from '@shared-modules/loading/loading.module';

import { DbWidgetHeaderComponent } from '@dashboard/components/layouts/db-widget-header/db-widget-header.component';
import { DbWidgetMenuComponent } from '@dashboard/components/layouts/db-widget-menu/db-widget-menu.component';
import { DbVehicleItemComponent } from '@dashboard/components/layouts/db-vehicle-item/db-vehicle-item.component';

import { DbLowFuelComponent } from './db-low-fuel.component';

describe('DbLowFuelComponent', () => {
  let component: DbLowFuelComponent;
  let fixture: ComponentFixture<DbLowFuelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, CustomMaterialModule, LoadingModule, PerfectScrollbarModule],
      declarations: [
        DbLowFuelComponent,
        DbWidgetHeaderComponent,
        DbWidgetMenuComponent,
        DbVehicleItemComponent
      ],
      providers: [
        {
          provide: 'window',
          useValue: window
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbLowFuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
