import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetConfirmationSummaryComponent } from './fleet-confirmation-summary.component';
import { TranslateTestingModule } from 'ngx-translate-testing';

describe('FleetConfirmationSummaryComponent', () => {
  let component: FleetConfirmationSummaryComponent;
  let fixture: ComponentFixture<FleetConfirmationSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateTestingModule.withTranslations({})],
      declarations: [FleetConfirmationSummaryComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetConfirmationSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
