import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderComponent } from '@shared-modules/loading/loader.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { MatDialogModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FleetHistoryDialogComponent } from '../fleet-history-dialog.component';
import { HistoryDialogHeaderComponent } from './history-dialog-header.component';

describe('FleetHistoryDialogComponent', () => {
  // class BannerStubComponent {}
  let component: FleetHistoryDialogComponent;
  let fixture: ComponentFixture<FleetHistoryDialogComponent>;

  // it('should return null if ID or code is missing', () => {
  //   component.displayFaultHistory(component.vId, component.fCode, component.page);
  //   expect(component.showLoader).toBe(false);
  // });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppRoutingModule,
        PerfectScrollbarModule,
        MatDialogModule,
        HttpClientModule,
        TranslateTestingModule.withTranslations({})
      ],
      declarations: [FleetHistoryDialogComponent, LoaderComponent, HistoryDialogHeaderComponent],
      providers: [
        {
          provide: 'window',
          useValue: window
        },
        {
          provide: APP_BASE_HREF,
          useValue: '/'
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetHistoryDialogComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
