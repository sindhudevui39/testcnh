import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { CustomMaterialModule } from '@shared-modules/custom-material/custom-material.module';
import { HeaderComponent } from './header.component';
import { User } from '@models/user';
import { UserService } from '@services/user/user.service';
import { RouterTestingModule } from '@angular/router/testing';
import { SideNavComponent } from '@shared-components/side-nav/side-nav.component';
import { AppNotificationHistroyComponent } from '@shared-components/app-notification-histroy/app-notification-histroy.component';
import { user } from 'src/app/test-constants/User';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CustomMaterialModule,
        HttpClientModule,
        TranslateTestingModule.withTranslations({}),
        RouterTestingModule.withRoutes([])
      ],
      declarations: [HeaderComponent, SideNavComponent, AppNotificationHistroyComponent],
      providers: [
        UserService,
        {
          provide: 'window',
          useValue: window
        },
        MatDialog
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    component.user = user;
    expect(component).toBeTruthy();
  });
});
