import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { CustomMaterialModule } from '@shared-modules/custom-material/custom-material.module';
import { LoadingModule } from '@shared-modules/loading/loading.module';

import { DbAreaCoveredComponent } from './db-area-covered.component';
import { DbWidgetHeaderComponent } from '@dashboard/components/layouts/db-widget-header/db-widget-header.component';
import { DbWidgetMenuComponent } from '@dashboard/components/layouts/db-widget-menu/db-widget-menu.component';
import { DbVehicleItemComponent } from '@dashboard/components/layouts/db-vehicle-item/db-vehicle-item.component';

describe('DbAreaCoveredComponent', () => {
  let component: DbAreaCoveredComponent;
  let fixture: ComponentFixture<DbAreaCoveredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, CustomMaterialModule, LoadingModule],
      declarations: [
        DbAreaCoveredComponent,
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
    fixture = TestBed.createComponent(DbAreaCoveredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
