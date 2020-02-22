import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DbAddWidgetDialogComponent } from './db-add-widget-dialog.component';
import { DashboardService } from '@dashboard/services/dashboard/dashboard.service';
import { CustomMaterialModule } from '@shared-modules/custom-material/custom-material.module';
import { UserService } from '@services/user/user.service';
import { WidgetOrder } from '@dashboard/utils/db-widgets.enum';

describe('DbAddWidgetDialogComponent', () => {
  let component: DbAddWidgetDialogComponent;
  let fixture: ComponentFixture<DbAddWidgetDialogComponent>;
  let dashboardService: DashboardService;

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CustomMaterialModule],
      declarations: [DbAddWidgetDialogComponent],
      providers: [UserService, DashboardService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbAddWidgetDialogComponent);
    dashboardService = TestBed.get(DashboardService);
    component = fixture.componentInstance;

    const userPref: Array<WidgetOrder> = [
      {
        element: 'sindhu',
        index: 12
      }
    ];

    dashboardService.userPreferences = userPref;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
