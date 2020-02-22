import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { DbDailyFuelComponent } from './db-daily-fuel.component';
import { DbWidgetHeaderComponent } from '@dashboard/components/layouts/db-widget-header/db-widget-header.component';
import { DbWidgetMenuComponent } from '@dashboard/components/layouts/db-widget-menu/db-widget-menu.component';
import { DbVehicleItemComponent } from '@dashboard/components/layouts/db-vehicle-item/db-vehicle-item.component';
import { CustomMaterialModule } from '@shared-modules/custom-material/custom-material.module';
import { LoadingModule } from '@shared-modules/loading/loading.module';
import { ApiService } from '@services/api/api.service';

describe('DbDailyFuelComponent', () => {
  let component: DbDailyFuelComponent;
  let fixture: ComponentFixture<DbDailyFuelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, CustomMaterialModule, LoadingModule],
      declarations: [
        DbDailyFuelComponent,
        DbWidgetHeaderComponent,
        DbWidgetMenuComponent,
        DbVehicleItemComponent
      ],
      providers: [
        ApiService,
        {
          provide: 'window',
          useValue: window
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbDailyFuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
