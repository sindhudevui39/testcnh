import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChartsModule } from 'ng2-charts';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { CustomMaterialModule } from '@shared-modules/custom-material/custom-material.module';
import { LoadingModule } from '@shared-modules/loading/loading.module';
import { Vehicle } from '@dashboard/models/db-vehicle.model';
import { DbVehicleSatusComponent } from './db-vehicle-satus.component';
import { ListByStatus } from './db-vehicle-status.properties';
import { DbWidgetMenuComponent } from '@dashboard/components/layouts/db-widget-menu/db-widget-menu.component';
import { DbVehicleItemComponent } from '@dashboard/components/layouts/db-vehicle-item/db-vehicle-item.component';
import { DbWidgetHeaderComponent } from '@dashboard/components/layouts/db-widget-header/db-widget-header.component';

describe('DbVehicleSatusComponent', () => {
  let component: DbVehicleSatusComponent;
  let fixture: ComponentFixture<DbVehicleSatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ChartsModule,
        HttpClientTestingModule,
        CustomMaterialModule,
        LoadingModule,
        PerfectScrollbarModule
      ],
      declarations: [
        DbVehicleSatusComponent,
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
    fixture = TestBed.createComponent(DbVehicleSatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const _refData = [
    {
      id: '712316c4-cc27-e447-7013-ba28dbb6296d',
      name: '1223-09000254',
      serialNumber: '1223-09000254',
      model: 'Magnum 340',
      brand: 'Case IH',
      type: { code: 'TRACTOR', name: 'Tractor' },
      location: [45.1943702, 7.7222471],
      fleets: [{ id: 1, name: 'CNH EVO' }],
      status: { id: 0, name: 'OFF' },
      heading: 0,
      lastUpdate: '2018-05-04T11:37:18Z',
      parameters: [
        { label: 'Engine hours', value: 2474, unit: 'h', code: 'ENG_HOUR' },
        { label: 'Ground speed', unit: 'Km/h', code: 'GROUND_SPEED' }
      ]
    }
  ];

  const vehicle: ListByStatus = {
    status: 'OFF',
    data: [
      {
        name: '1223-09000254',
        model: 'Magnum 340',
        id: '712316c4-cc27-e447-7013-ba28dbb6296d'
      } as Vehicle
    ]
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate data-list', () => {
    const _dataList: Array<Vehicle> = [
      {
        name: '1223-09000254',
        model: 'Magnum 340',
        id: '712316c4-cc27-e447-7013-ba28dbb6296d'
      }
    ];
    const status = 'OFF';

    component.dataListFn(_refData, status);

    expect(component.dataList).toEqual(_dataList);
  });

  it('should populate vehicle list data', () => {
    component._refData = _refData;
    component.setupVehicleData(_refData);

    expect(component.allStatusVList[5]).toEqual(vehicle);
  });

  it('should populate ChartLabel Data', () => {
    component._refData = _refData;
    component.setupVehicleData(_refData);

    const data2 = [
      { label: 'In Work', color: '#25b03d', data: 0, status: 'WORKING' },
      { label: 'Key On', color: '#ffc107', data: 0, status: 'KEYON' },
      { label: 'Idle', color: '#f47825', data: 0, status: 'IDLE' },
      { label: 'Moving', color: '#01a8b4', data: 0, status: 'MOVING' },
      { label: 'Travelling', color: '#035db1', data: 0, status: 'TRAVELLING' },
      { label: 'Engine Off', color: '#adadad', data: 1, status: 'OFF' }
    ];

    component.setupChartData();
    expect(component.chartLabels).toEqual(data2);
  });
});
