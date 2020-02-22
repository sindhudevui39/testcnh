import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ChartsModule } from 'ng2-charts';

import { DbHomeComponent } from './db-home.component';
import { dashboardWidgets, entryComponentWidgets } from '@dashboard/components/widgets-imports';
import { dashboardLayouts, entryComponentLayouts } from '@dashboard/components/layouts-imports';
import { DraggableDirective } from '@shared-directives/draggable/draggable.directive';
import { DashboardService } from '@dashboard/services/dashboard/dashboard.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomMaterialModule } from '@shared-modules/custom-material/custom-material.module';
import { LoadingModule } from '@shared-modules/loading/loading.module';
import { UserService } from '@services/user/user.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('DbHomeComponent', () => {
  let component: DbHomeComponent;
  let fixture: ComponentFixture<DbHomeComponent>;

  // Dependency Injection variables
  let dashboardService: DashboardService;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CustomMaterialModule,
        LoadingModule,
        ChartsModule,
        PerfectScrollbarModule,
        RouterTestingModule
      ],
      declarations: [DbHomeComponent, ...dashboardWidgets, ...dashboardLayouts, DraggableDirective],
      providers: [UserService, DashboardService]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [...entryComponentWidgets, ...entryComponentLayouts]
        }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbHomeComponent);
    component = fixture.componentInstance;

    userService = TestBed.get(UserService);
    dashboardService = TestBed.get(DashboardService);

    userService.user = {
      firstName: 'Luke',
      lastName: 'Skywalker',
      email: 'cnhdemouser@mailinator.com',
      roles: 'admin',
      brand: 'CIH',
      isDealer: false,
      isEulaAccepted: true
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
