import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { SideNavComponent } from './side-nav.component';
import { AppSettingsService } from '@services/app-settings/app-settings.service';
import { AppSettings } from '@models/app-settings';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { APP_BASE_HREF } from '@angular/common';
import { UserService } from '@services/user/user.service';
import { user } from 'src/app/test-constants/User';

const appSettings: AppSettings = {
  clientID: '1',
  domain: '1',
  audience: '1',
  connection: '1',
  redirectUri: '1',
  fleetRedirect: '1',
  farmRedirect: '1',
  dataRedirect: '1',
  userBrand: '',
  evoNotificationPath: '',
  evoNotificationUrl: '',
  myCaseBrandUrl: '',
  myNhBrandUrl: '',
  canFeature: '',
  etimDashboard: '',
  etimSmartView: '',
  dpLogoutUrl: ''
};

describe('SideNavComponent', () => {
  let component: SideNavComponent;
  let fixture: ComponentFixture<SideNavComponent>;
  let appSettingsService: AppSettingsService;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SideNavComponent],
      imports: [
        AppRoutingModule,
        TranslateTestingModule.withTranslations({}),
        HttpClientTestingModule
      ],
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
    fixture = TestBed.createComponent(SideNavComponent);
    component = fixture.componentInstance;
    appSettingsService = TestBed.get(AppSettingsService);
    userService = TestBed.get(UserService);

    appSettingsService.appSettings = appSettings;
    userService.user = user;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
