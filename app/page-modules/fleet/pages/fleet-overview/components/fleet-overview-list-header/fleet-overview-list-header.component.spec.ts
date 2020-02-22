import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetOverviewListHeaderComponent } from './fleet-overview-list-header.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { MatDialogModule } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FleetOverviewListHeaderComponent', () => {
  let component: FleetOverviewListHeaderComponent;
  let fixture: ComponentFixture<FleetOverviewListHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateTestingModule.withTranslations({}),
        HttpClientTestingModule,
        MatDialogModule
      ],
      declarations: [FleetOverviewListHeaderComponent],
      providers: [
        {
          provide: 'window',
          useValue: window
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetOverviewListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
