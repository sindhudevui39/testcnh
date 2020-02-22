import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { DbFaultsComponent } from './db-faults.component';
import { UtilService } from '@services/util/util.service';
import { CustomMaterialModule } from '@shared-modules/custom-material/custom-material.module';
import { LoadingModule } from '@shared-modules/loading/loading.module';
import { Fault } from '@dashboard/models/db-fault.model';
import { DbFaultItemComponent } from '@dashboard/components/layouts/db-fault-item/db-fault-item.component';
import { DbWidgetHeaderComponent } from '@dashboard/components/layouts/db-widget-header/db-widget-header.component';
import { DbWidgetMenuComponent } from '@dashboard/components/layouts/db-widget-menu/db-widget-menu.component';

describe('DbFaultsComponent', () => {
  let component: DbFaultsComponent;
  let fixture: ComponentFixture<DbFaultsComponent>;
  let service: UtilService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, CustomMaterialModule, LoadingModule, PerfectScrollbarModule],
      declarations: [
        DbFaultsComponent,
        DbFaultItemComponent,
        DbWidgetHeaderComponent,
        DbWidgetMenuComponent
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
    fixture = TestBed.createComponent(DbFaultsComponent);
    service = TestBed.get(UtilService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set up the fault details', () => {
    expect(component._refData).not.toBeNull();
  });

  it('should set no data to true when there is no data', () => {
    component._refData = [];
    component.setFaultsData(component._refData);
    expect(component.noData).toBe(true);
  });

  it('should populate Faults', () => {
    component._refData = {
      id: 20553,
      title: 'Engine Coolant Temperature HIGH',
      severity: 'HIGH',
      code: 'A-0000',
      created: '2018-06-22T16:02:31Z',
      assetDetail: {
        id: 'c6cd4b37-be6f-9ed0-bdc1-43a92ff01dfa',
        name: 'QA AM53 1223-09001CF1',
        brand: 'Case IH',
        Hours: { value: 0.085, unit: 'h' },
        model: 'vehicle model'
      }
    };
    const _faultTime = service.convertDate('2018-06-22T16:02:31Z');
    const fault: Fault = {
      id: 20553,
      faultName: 'Engine Coolant Temperature HIGH',
      companyName: 'Case IH',
      vehicleName: 'QA AM53 1223-09001CF1',
      vehicleId: 'c6cd4b37-be6f-9ed0-bdc1-43a92ff01dfa',
      faultTime: _faultTime,
      model: 'vehicle model'
    };
    component.setupFaultDetails([component._refData]);
    expect(component.faults).toEqual([fault]);
  });
});
