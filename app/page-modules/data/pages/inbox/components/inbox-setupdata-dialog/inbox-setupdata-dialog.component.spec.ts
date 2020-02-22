import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import {
  MatMenuModule,
  MatDialogModule,
  MatSnackBarModule,
  MatIconModule,
  MatTableModule,
  MatCheckboxModule
} from '@angular/material';
import { MatTableDataSource, MatDialogRef } from '@angular/material';
import { ApiService } from '@services/api/api.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Injector } from '@angular/core';
import { InboxSetupdataDialogComponent } from './inbox-setupdata-dialog.component';
import { CnhHighlightPipe } from '../../pipe/cnh-highlights-pipe';
import { DataFileService } from '../../services/data-file.service';
import { DataFile } from '../../models/data-file.model';
import {
  TranslateCompiler,
  TranslateFakeCompiler,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { By } from 'selenium-webdriver';

const translations: any = {
  SEND_DATA: {
    brand_MODEL: 'brand | model',
    CLEAR_ALL: 'clear all',
    FILE_TRANSFER_TITLE: 'File Transfer',
    NO_DATA: 'There is no data for this Field',
    NO_FIELDS: 'Please select a Field on the left to view Setup Data',
    PIN: 'pin',
    REMOVE_ITEM_WARNING: 'Cannot delete item. At least one item needs to be selected',
    REMOVE_VEHICLE_WARNING: 'Cannot delete vehicle. At least one item needs to be selected',
    SELECT_VEHICLES: 'Select Vehicle(s)',
    SELECT_VEHICLE_SUBTITLE: 'Only vehicles with File Transfer Subscription are shown',
    SENDING_ITEMS: 'Sending {{ vehicles }} Items to',
    VEHICLE_NAME: 'vehicle name',
    VEHICLE_SELECTION: 'vehicle selection',
    PLURAL: 'Vehicles',
    SEND_TO_VEHICLE: 'Send to vehicle'
  },
  GLOBAL: {
    CANCEL: 'cancel',
    CONFIRM: 'confirm'
  }
};

export class FakeLoader implements TranslateLoader {
  getTranslation(lang: string) {
    return of(translations);
  }
}

export class MockApiService {
  getVehicleData() {
    return of([
      {
        id: '89f8354c-f32f-d477-7dbe-c74fa0584fa4',
        name: 'TEST - AM53 1223-09000969',
        brand: 'New Holland AG',
        model: 'SPEEDROWER® 130',
        checked: false
      },
      {
        id: 'cd87016e-9926-264a-789e-98526abbb8c0',
        name: 'QA AM53 1223-09003638',
        brand: 'Case IH',
        model: 'SPEEDROWER® 130',
        checked: false
      },
      {
        id: '1223-09003DD59',
        name: '1223-09003DD59',
        brand: 'Case IH',
        model: 'Magnum 260',
        checked: false
      },
      {
        id: '1223-0900EE88',
        name: '1223-0900EE88',
        brand: 'Case IH',
        model: 'Magnum 260',
        checked: false
      },
      {
        id: '1223-0900FF88',
        name: '1223-0900FF88',
        brand: 'Case IH',
        model: 'Magnum 260',
        checked: false
      }
    ]);
  }
}

describe('InboxSetupdataDialogComponent', () => {
  let component: InboxSetupdataDialogComponent;
  let fixture: ComponentFixture<InboxSetupdataDialogComponent>;
  let translate: TranslateService;
  let injector: Injector;

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  class MockDataFileService {
    filteredDataFiles$: Observable<DataFile[]>;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatDialogModule,
        MatMenuModule,
        MatSnackBarModule,
        MatIconModule,
        MatTableModule,
        MatCheckboxModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader },
          compiler: { provide: TranslateCompiler, useClass: TranslateFakeCompiler }
        })
      ],
      declarations: [InboxSetupdataDialogComponent, CnhHighlightPipe],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MatTableDataSource, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        {
          provide: 'window',
          useValue: window
        },
        { provide: DataFileService, useClass: MockDataFileService },
        { provide: ApiService, useClass: MockApiService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboxSetupdataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    injector = getTestBed();
    translate = injector.get(TranslateService);
    translate.use('en');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have mat dialog content header', async () => {
    const fixture = TestBed.createComponent(InboxSetupdataDialogComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('mat-dialog-content').textContent).toContain('Select Vehicle(s)');
    expect(compiled.querySelector('mat-dialog-content').textContent).toContain(
      'Only vehicles with File Transfer Subscription are shown'
    );
  });

  it('should have cancel button in actions', async () => {
    const fixture = TestBed.createComponent(InboxSetupdataDialogComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(
      compiled.querySelector('mat-dialog-actions button[type="button"]').textContent
    ).toContain('CANCEL');
  });

  it('Vehicles table should contain vehicle details', async () => {
    const fixture = TestBed.createComponent(InboxSetupdataDialogComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('mat-table mat-row:nth-child(1)').textContent).toContain(
      'TEST - AM53 1223-09000969'
    );
    expect(compiled.querySelector('mat-table mat-row:nth-child(5)').textContent).toContain(
      '1223-0900FF88'
    );
  });
});
